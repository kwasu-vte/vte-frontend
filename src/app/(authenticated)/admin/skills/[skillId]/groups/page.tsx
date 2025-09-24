import { api } from '@/lib/api';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminSkillGroupsPage({ params }: { params: Promise<{ skillId: string }> }) {
	const { skillId } = await params;
	const skillRes = await api.getSkill(skillId).catch(() => null);
	if (!skillRes?.data) return notFound();

	const groupsRes = await api.getGroupsBySkill(skillId, { include_full: true }).catch(() => null);
	const groups = groupsRes?.data ?? [];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-neutral-900">{skillRes.data.title} • Groups</h1>
				<p className="text-neutral-600 mt-1">Manage groups and view capacity for this skill.</p>
			</div>
			<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{groups.length === 0 ? (
						<div className="col-span-full text-neutral-600">No groups found for this skill.</div>
					) : (
						groups.map((g) => (
							<div key={g.id} className="border border-neutral-200 rounded-lg p-4">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-semibold text-neutral-900">Group {g.group_display_name || g.group_number}</h3>
									<span className={`px-2 py-0.5 rounded-md text-xs ${g.is_full ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{g.is_full ? 'Full' : 'Has Capacity'}</span>
								</div>
								<p className="text-sm text-neutral-600 mt-2">{g.current_student_count}/{g.max_student_capacity} students • {Math.round(Number(g.capacity_percentage) || 0)}%</p>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
