import { z } from 'zod';
import PageContent from '~/components/layout/page-content';
import { columns } from '~/components/profiles/table-columns';
import { DataTable } from '~/components/table/data-table';
import { profileSchema } from '~/types/profile';

export default function Profiles() {
  const data = [
    {
      code: 'TASK-8782',
      name: 'Alice Johnson',
    },
    {
      code: 'TASK-7878',
      name: 'Bob Smith',
    },
    {
      code: 'TASK-7839',
      name: 'Carol Davis',
    },
    {
      code: 'TASK-5562',
      name: 'David Wilson',
    },
    {
      code: 'TASK-8686',
      name: 'Emma Brown',
    },
    {
      code: 'TASK-1280',
      name: 'Frank Miller',
    },
    {
      code: 'TASK-7262',
      name: 'Grace Lee',
    },
    {
      code: 'TASK-1138',
      name: 'Henry Garcia',
    },
    {
      code: 'TASK-7184',
      name: 'Ivy Chen',
    },
    {
      code: 'TASK-5160',
      name: 'Jack Anderson',
    },
    {
      code: 'TASK-5618',
      name: 'Kate Thompson',
    },
    {
      code: 'TASK-6699',
      name: 'Liam Rodriguez',
    },
    {
      code: 'TASK-2858',
      name: 'Maya Patel',
    },
    {
      code: 'TASK-9864',
      name: 'Noah Martinez',
    },
    {
      code: 'TASK-8404',
      name: 'Olivia Taylor',
    },
  ];
  const profiles = z.array(profileSchema).parse(data);

  return (
    <PageContent title="PROFILES TODO" subtitle="Here's a list of your profiles!">
      <DataTable
        tableProps={{ data: profiles, columns }}
        textFilters={[{ title: 'Name', column: 'name' }]}
      />
    </PageContent>
  );
}
