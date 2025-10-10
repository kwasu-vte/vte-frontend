import { skillsApi } from '@/lib/api';
import { notFound } from 'next/navigation';
import SkillGroupsClient from './SkillGroupsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSkillGroupsPage({ params }: { params: Promise<{ skillId: string }> }) {
	const { skillId } = await params;
	const skillRes = await skillsApi.getById(skillId).catch(() => null);
	if (!skillRes?.data) return notFound();

	const groupsRes = await skillsApi.getGroupsBySkill(skillId, { include_full: true }).catch(() => null);
	const groups = groupsRes?.data ?? [];

	return <SkillGroupsClient skillTitle={skillRes.data.title} groups={groups} />
	;
}
