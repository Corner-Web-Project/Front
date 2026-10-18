// Matches Back dto/response/ProjectResponse.java.
export interface ProjectSummary {
  projectId: number;
  generation: number;
  title: string;
  subtitle: string | null;
  banner: string | null;
  logo: string | null;
}

export interface ProjectDetail extends ProjectSummary {
  description: string;
  stacks: string[];
  members: { name: string; role: string }[];
}

export interface ProjectPage {
  projects: ProjectSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSummary(value: unknown): value is ProjectSummary {
  return isRecord(value) && Number.isSafeInteger(value.projectId) && Number(value.projectId) > 0
    && Number.isInteger(value.generation) && Number(value.generation) > 0
    && typeof value.title === 'string'
    && ['subtitle', 'banner', 'logo'].every((key) => value[key] === null || typeof value[key] === 'string');
}

export function parseProjectPage(value: unknown): ProjectPage {
  if (!isRecord(value) || !Array.isArray(value.projects) || !value.projects.every(isSummary)
    || !['page', 'size', 'totalElements', 'totalPages'].every((key) => Number.isSafeInteger(value[key]) && Number(value[key]) >= 0)) {
    throw new Error('프로젝트 목록 응답 형식이 API 명세와 다릅니다.');
  }
  return value as unknown as ProjectPage;
}

export function parseProjectDetail(value: unknown): ProjectDetail {
  if (!isSummary(value) || !isRecord(value) || typeof value.description !== 'string'
    || !Array.isArray(value.stacks) || !value.stacks.every((stack) => typeof stack === 'string')
    || !Array.isArray(value.members) || !value.members.every((member) =>
      isRecord(member) && typeof member.name === 'string' && typeof member.role === 'string')) {
    throw new Error('프로젝트 상세 응답 형식이 API 명세와 다릅니다.');
  }
  return value as unknown as ProjectDetail;
}
