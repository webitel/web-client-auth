<template>
  <main
    class="auth"
    :class="{ 'auth--xs': $breakpoint.xsOnly }"
  >
    <wt-notifications-bar></wt-notifications-bar>
    <section class="auth-form-wrapper">
      <div class="auth-form-wrapper__content">
        <header class="auth-form-wrapper__header">
          <wt-logo :dark-mode="theme === 'dark'" />
          <wt-dark-mode-switcher />
        </header>
        <h1 class="auth-tabs-title typo-heading-3">{{ currentTab.title }}</h1>
        <component
          :is="currentTab.component"
          @change-tab="handleChangeTab"
          @submit="authorization(activeTab)"
        />
      </div>
    </section>
    <section class="auth-info">
      <div class="carousel-wrap">
        <flicking
          :options="{ circular: true, duration: 700 }"
          :plugins="plugins"
        >
          <contact-center-slide
            key="1"
            class="card-panel"
          />
          <supervisor-slide
            key="2"
            class="card-panel"
          />
          <chats-slide
            key="3"
            class="card-panel"
          />
          <history-and-analytics-slide
            key="4"
            class="card-panel"
          />
          <template #viewport>
            <div class="flicking-pagination"></div>
          </template>
        </flicking>
      </div>
      <div class="auth-info__background" />
    </section>
  </main>
</template>

<script setup>
import '@egjs/vue3-flicking/dist/flicking.css';

import { AutoPlay, Pagination } from '@egjs/flicking-plugins';
import Flicking from '@egjs/vue3-flicking';
import { createAppearanceStore } from '@webitel/ui-sdk/modules/Appearance/pinia/store/AppearanceStore';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../stores/useAuthStore.ts';
import { AuthMode } from '../enums/index.ts';

import Login from './login/the-login.vue';
import Register from './register/the-register.vue';
import ChatsSlide from './slides/chats-slide.vue';
import ContactCenterSlide from './slides/contact-center-slide.vue';
import HistoryAndAnalyticsSlide from './slides/history-and-analytics-slide.vue';
import SupervisorSlide from './slides/supervisor-slide.vue';

const useAppearanceStore = createAppearanceStore();
const appearanceStore = useAppearanceStore();
const authStore = useAuthStore();

const { t } = useI18n();

const { submitRegister, submitLogin } = authStore;

const plugins = [
	new Pagination({
		type: 'bullet',
	}),
	new AutoPlay({
		duration: 9000,
		stopOnHover: false,
	}),
];

const activeTab = ref(AuthMode.LOGIN);

const tabs = computed(() => {
	return [
		{
			title: t('auth.signIn'),
			text: t('auth.login'),
			value: AuthMode.LOGIN,
			component: Login,
		},
		{
			title: t('auth.titleRegistration'),
			text: t('auth.register'),
			value: AuthMode.REGISTER,
			component: Register,
		},
	];
});

const currentTab = computed(() => {
	return (
		tabs.value.find(({ value }) => value === activeTab.value) || tabs.value[0]
	);
});
const theme = computed(() => appearanceStore.theme);

const handleChangeTab = ({ value }) => {
	activeTab.value = value;
};

const authorization = async (tab) => tab === AuthMode.REGISTER ? submitRegister() : submitLogin();
</script>

<style lang="scss">
@use '@webitel/styleguide/viewport-breakpoints' as *;

$form-width-lg: 528px;
$form-width-md: 384px;
$form-width-sm: 576px;
$slide-width-lg: 1024px;
$slide-width-md: 640px;

.auth {
  position: relative;
  display: flex;
  overflow: hidden;
  height: 100%;
  background: var(--wt-page-wrapper-background-color);

  .auth-form-wrapper {
    max-height: 100%;
    position: relative;
    z-index: 2;
    display: flex;
    flex: 0 0 $form-width-lg;
    background: var(--wt-page-wrapper-background-color);
  }

  .auth-form-wrapper__content {
    width: 100%;
    padding: var(--spacing-md);
    box-sizing: border-box;
    background: var(--content-wrapper-color);
    border-radius: var(--border-radius);
    overflow: auto;

    .auth-form-wrapper__header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .auth-tabs-title {
      margin: var(--spacing-lg) auto;
      text-align: center;
    }
  }

  .logo {
    width: 88px;
  }

  .auth-form-header__title {
    margin-bottom: var(--spacing-sm);
  }

  .auth-form-header__subtitle {
    margin-bottom: var(--spacing-sm);
  }

  .auth-info {
    flex-grow: 1;
    min-width: 0;
    color: var(--white);

    &__background {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 0;
      min-height: 100%;
      min-width: 100%;
      height: 1080px;
      width: 1920px;
      background: url('../assets/img/auth/background.svg') no-repeat;
      background-size: cover;
    }
  }

  .carousel-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .flicking-pagination-bullet {
      cursor: pointer;
      display: inline-block;
      font-size: 1rem;
      height: 8px;
      margin: 0 4px;
      width: 8px;
      background-color: #F7F7F7;
    }

    .flicking-pagination-bullet-active {
      background-color: #FF2BD4;
    }

    .flicking-pagination {
      position: relative;
      width: fit-content;
      left: calc(50% - ($slide-width-lg / 2));
      bottom: 0;
    }
  }
}

.auth--xs {
  .auth-form-header__title {
    text-align: center;
    margin-bottom: var(--spacing-xs);
  }
}

@media (max-width: $viewport-lg) {
  .auth {
    .auth-form-wrapper {
      flex: 0 0 $form-width-md;
    }

    .auth-form-wrapper__content {
      padding: var(--spacing-md);
    }

    .carousel-wrap .flicking-pagination {
      left: calc(50% - ($slide-width-md / 2));
    }
  }
}

@media (max-width: $viewport-md) {
  .auth {
    display: flex;
    align-items: center;
    justify-content: center;

    .auth-form-wrapper {
      flex: 0 0 $form-width-sm;
      border-radius: var(--border-radius);
      margin: var(--spacing-sm) auto;
    }

    .logo {
      display: block;
      margin-bottom: var(--spacing-sm);
    }

    .auth-info {
      flex-grow: initial;
    }

    .carousel-wrap {
      display: none;
    }
  }
}

@media (max-width: $viewport-xs) {
  .auth {
    align-items: normal;

    .auth-form-wrapper {
      flex: none;
      width: 100%;
      margin: 0;
    }

    .auth-form-wrapper__content {
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: var(--spacing-md);
    }

    .logo {
      margin-bottom: var(--spacing-xs);
    }

    .auth-form-header__subtitle {
      margin-bottom: var(--spacing-xs);
      text-align: center;
    }

    .auth-info {
      position: relative;
      display: none;
    }
  }
}
</style>
