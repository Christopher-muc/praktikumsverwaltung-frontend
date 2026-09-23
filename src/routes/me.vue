<template>
  <student-detail
    v-if="student"
    :student="student"
    :praktikum="praktikum"
    :can-write-activity="true"
    :can-write-zeitgutschrift="canWriteZeitgutschrift"
    @changed="loadPraktikum"
  />
</template>

<script setup lang="ts">
import type {
  FullPraktikumDTO,
  StudentDTO,
} from "@/api/generated/api-spec/models";

import { onMounted, ref } from "vue";

import { ApiFactory } from "@/api/ApiFactory";
import {
  PraktikumControllerApi,
  StudentControllerApi,
} from "@/api/generated/api-spec";
import { ResponseError } from "@/api/generated/api-spec/runtime";
import StudentDetail from "@/components/student/StudentDetail.vue";
import useHasAnyRole from "@/composables/useHasAnyRole";
import { Role } from "@/types/Role";
import { useUserInfoStore } from "@/stores/userinfo.ts";

definePage({
  meta: {
    hasAnyRole: [Role.STUDENT, Role.FACHSTUDENT],
  },
});

const studentApi = ApiFactory.getInstance(StudentControllerApi);
const praktikumApi = ApiFactory.getInstance(PraktikumControllerApi);

const canWriteZeitgutschrift = useHasAnyRole(Role.FACHSTUDENT);

const student = ref<StudentDTO>();
const praktikum = ref<FullPraktikumDTO>();

const userInfoStore = useUserInfoStore();

async function loadStudent() {
  if (userInfoStore.userInfo === null) {
    return;
  }

  const studentId = Number(
    userInfoStore.userInfo.preferred_username
  );

  if (!Number.isInteger(studentId) || studentId <= 0) {
    return;
  }

  student.value = await studentApi.getStudent(studentId);
}

async function loadPraktikum() {
  const studentId = student.value?.studentId;

  if (studentId === undefined) {
    return;
  }

  try {
    praktikum.value =
      await praktikumApi.getPraktikum(studentId);
  } catch (error) {
    if (
      error instanceof ResponseError &&
      error.response.status === 404
    ) {
      praktikum.value = undefined;
      return;
    }

    throw error;
  }
}

onMounted(async () => {
  await loadStudent();
  await loadPraktikum();
});
</script>