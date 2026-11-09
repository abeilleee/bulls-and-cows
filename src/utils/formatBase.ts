import { BASE_LABELS } from '@/constants';
import type { Base } from '@/core/types';

export const formatBase = (base: Base) => BASE_LABELS[base];
