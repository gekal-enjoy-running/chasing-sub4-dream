import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PageHeading } from '@/components/atoms/page-heading';
import { SectionHeading } from '@/components/atoms/section-heading';
import { ExerciseCard } from '@/components/molecules/exercise-card';
import { getAllExercises, hasAnimation } from '@/lib/content';
import { groupByCategory } from '@/lib/exercises';

const description = '热身、拉伸、力量、跑步技术的每一个动作：动图示意、步骤、要点和需要的用具。';

export const metadata: Metadata = {
  title: '动作库',
  description,
  alternates: { canonical: '/exercises/' },
};

export default function ExercisesPage() {
  const groups = groupByCategory(getAllExercises());
  return (
    <>
      <PageHeading title="动作库" lead={description} />
      {groups.map(group => (
        <Box
          key={group.key}
          component="section"
          aria-labelledby={`${group.key}-heading`}
          sx={{ mb: 6 }}
        >
          <SectionHeading
            id={`${group.key}-heading`}
            title={group.label}
            more={{ href: group.guide, label: `${group.label}指南` }}
          />
          <Grid container spacing={2}>
            {group.exercises.map(exercise => (
              <Grid key={exercise.slug} size={{ xs: 6, sm: 4, md: 3 }}>
                <ExerciseCard exercise={exercise} animated={hasAnimation(exercise.slug)} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </>
  );
}
