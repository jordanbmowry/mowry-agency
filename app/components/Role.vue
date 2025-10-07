<template>
  <li class="flex gap-4">
    <div
      class="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0"
    >
      <NuxtImg :src="role.logo" alt="" class="h-7 w-7" loading="lazy" />
    </div>
    <dl class="flex flex-auto flex-wrap gap-x-2">
      <dt class="sr-only">Company</dt>
      <dd
        class="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100"
      >
        {{ role.company }}
      </dd>
      <dt class="sr-only">Role</dt>
      <dd class="text-xs text-zinc-500 dark:text-zinc-400">
        {{ role.title }}
      </dd>
      <dt class="sr-only">Date</dt>
      <dd
        class="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
        :aria-label="`${startLabel} until ${endLabel}`"
      >
        <time :dateTime="startDate">{{ startLabel }}</time>
        {{ ' ' }}
        <span aria-hidden="true">—</span>
        {{ ' ' }}
        <time :dateTime="endDate">{{ endLabel }}</time>
      </dd>
    </dl>
  </li>
</template>

<script setup lang="ts">
interface Role {
  company: string;
  title: string;
  logo: string;
  start: string | { label: string; dateTime: string };
  end: string | { label: string; dateTime: string };
}

interface Props {
  role: Role;
}

const props = defineProps<Props>();

const startLabel = computed(() =>
  typeof props.role.start === 'string'
    ? props.role.start
    : props.role.start.label
);

const startDate = computed(() =>
  typeof props.role.start === 'string'
    ? props.role.start
    : props.role.start.dateTime
);

const endLabel = computed(() =>
  typeof props.role.end === 'string' ? props.role.end : props.role.end.label
);

const endDate = computed(() =>
  typeof props.role.end === 'string' ? props.role.end : props.role.end.dateTime
);
</script>
