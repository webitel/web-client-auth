<template>
  <!-- the sign-in page is the one place without settings: let users start recording here; the REC chip then stops it -->
  <wt-button
    v-if="available && !recording && enabledUntil === null"
    :variant="ButtonVariant.TEXT"
    :color="ButtonColor.SECONDARY"
    :size="ComponentSize.SM"
    :loading="busy"
    @click="setRecording(true)"
  >
    {{ t('auth.recordDebugLogs') }}
  </wt-button>
</template>

<script setup lang="ts">
import {
	ButtonColor,
	ButtonVariant,
	ComponentSize,
} from '@webitel/ui-sdk/enums';
import { useDebugRecorder } from '@webitel/ui-sdk/modules/DebugRecorder/composables';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { available, recording, enabledUntil, busy, setRecording } =
	useDebugRecorder();
</script>
