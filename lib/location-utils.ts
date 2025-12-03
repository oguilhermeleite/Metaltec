// Location utilities for smart storage suggestions

export type LocationStatus = 0 | 1 | 2 | 'OK';

export interface LocationInfo {
  column: string;
  status: LocationStatus;
  available: boolean;
  priority: number; // Lower is better (0 = empty, best)
}

export interface SmartSuggestion {
  floor: number;
  column: string;
  status: LocationStatus;
  reason: string;
}

/**
 * Analyzes product locations and suggests the best place to store new items
 * Priority: Empty (0) > Space for 1 (1) > Full (2) > In Production (OK)
 */
export function suggestBestLocation(
  productFloor: number,
  locations: Record<string, LocationStatus>
): SmartSuggestion | null {
  const columns = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];
  const availableLocations: LocationInfo[] = [];

  for (const column of columns) {
    const status = locations[column] ?? 0;

    // Skip full locations (2) and in production (OK)
    if (status === 2 || status === 'OK') {
      continue;
    }

    availableLocations.push({
      column,
      status: status as LocationStatus,
      available: true,
      priority: status === 0 ? 0 : 1, // Empty = priority 0, Has space = priority 1
    });
  }

  if (availableLocations.length === 0) {
    return null; // No space available
  }

  // Sort by priority (lower is better), then by column name for consistency
  availableLocations.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.column.localeCompare(b.column);
  });

  const best = availableLocations[0];

  return {
    floor: productFloor,
    column: best.column,
    status: best.status,
    reason: best.status === 0
      ? `Coluna ${best.column} está vazia - localização ideal!`
      : `Coluna ${best.column} tem espaço para mais 1 caixa`,
  };
}

/**
 * Calculates total boxes stored for a product across all locations
 */
export function calculateTotalBoxes(locations: Record<string, LocationStatus>): number {
  return Object.values(locations).reduce((total, status) => {
    if (typeof status === 'number') {
      return total + status;
    }
    return total;
  }, 0);
}

/**
 * Gets human-readable status label
 */
export function getStatusLabel(status: LocationStatus): string {
  if (status === 0) return 'Vazio';
  if (status === 1) return '1 caixa';
  if (status === 2) return 'Cheio (2 caixas)';
  if (status === 'OK') return 'Em Produção';
  return 'Desconhecido';
}

/**
 * Gets status color for UI
 */
export function getStatusColor(status: LocationStatus): string {
  if (status === 0) return 'green'; // Available
  if (status === 1) return 'yellow'; // Low stock
  if (status === 2) return 'red'; // Full
  if (status === 'OK') return 'blue'; // In production
  return 'gray';
}

/**
 * Gets status emoji
 */
export function getStatusEmoji(status: LocationStatus): string {
  if (status === 0) return '✅';
  if (status === 1) return '⚠️';
  if (status === 2) return '❌';
  if (status === 'OK') return '🔄';
  return '❓';
}

/**
 * Checks if a location can accept more boxes
 */
export function canAddBoxes(status: LocationStatus, quantity: number = 1): boolean {
  if (status === 'OK') return false; // In production
  if (typeof status !== 'number') return false;
  return (status + quantity) <= 2;
}

/**
 * Calculates new status after adding boxes
 */
export function calculateNewStatus(
  currentStatus: LocationStatus,
  boxesToAdd: number
): LocationStatus {
  if (currentStatus === 'OK') return 'OK';
  if (typeof currentStatus !== 'number') return currentStatus;

  const newValue = currentStatus + boxesToAdd;
  return Math.min(newValue, 2) as LocationStatus;
}

/**
 * Gets color name for Tailwind CSS classes
 */
export function getColorName(colorCode: string): string {
  const colorMap: Record<string, string> = {
    MA: 'Marrom',
    ME: 'Metálico',
    BZ: 'Bronze',
    BR: 'Branco',
    PT: 'Preto',
    CR: 'Cromado',
  };
  return colorMap[colorCode] || colorCode;
}

/**
 * Formats product code with color for display
 */
export function formatProductCode(code: string, color: string): string {
  return `${code} ${color}`;
}

/**
 * Checks if overflow space opened up for waiting items
 */
export function checkOverflowSpaceOpened(
  floor: number,
  column: string,
  oldStatus: LocationStatus,
  newStatus: LocationStatus
): boolean {
  // Space opened if:
  // - Changed from 2 to 1 (can now fit 1 box)
  // - Changed from 2 to 0 (can now fit 2 boxes)
  // - Changed from 1 to 0 (can now fit 2 boxes)
  if (oldStatus === 2 && (newStatus === 1 || newStatus === 0)) return true;
  if (oldStatus === 1 && newStatus === 0) return true;

  return false;
}

/**
 * Calculates days between two dates
 */
export function daysBetween(date1: Date, date2: Date = new Date()): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Formats date for display in Brazilian format
 */
export function formatDateBR(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats date and time for display
 */
export function formatDateTimeBR(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
