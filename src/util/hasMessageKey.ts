import { MessageObject } from '../types/base';

const hasMessageKey = (obj: unknown): obj is MessageObject => {
    if (obj && typeof obj === 'object' && 'message' in obj && typeof obj.message === 'string') return true;
    return false;
}

export default hasMessageKey;