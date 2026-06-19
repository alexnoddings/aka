import { campaignConstraints } from './campaignConstraints';

export type CampaignForm = {
    name: string;
    notes: string;
};

type CampaignFormErrors = {
    name?: string;
    notes?: string;
};

function getString(form: FormData, key: string): string {
    const value = form.get(key);
    if (!value || typeof value !== 'string') return '';
    return value.trim();
}

export function getCampaignForm(data: FormData): CampaignForm {
    return {
        name: getString(data, 'name'),
        notes: getString(data, 'notes')
    };
}

export function validateCampaignForm(form: CampaignForm): CampaignFormErrors | undefined {
    if (!form.name) return { name: 'Name is required' };
    if (form.name.length > campaignConstraints.name.maxLength) {
        return { name: `Name must be ${campaignConstraints.name.maxLength} characters or less` };
    }
    if (form.notes.length > campaignConstraints.notes.maxLength) {
        return { notes: `Notes must be ${campaignConstraints.notes.maxLength} characters or less` };
    }
    return undefined;
}

export async function campaignIdExists(id: string, db: D1Database): Promise<boolean> {
    const result = await db
        .prepare(`SELECT EXISTS(SELECT 1 FROM campaigns WHERE id=?) AS campaignExists`)
        .bind(id)
        .first<{ campaignExists: boolean }>();
    return result?.campaignExists ?? false;
}
