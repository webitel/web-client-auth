<template>
  <main
    class="auth"
    :class="{ 'auth--xs': $breakpoint.xsOnly }"
  >
    <wt-notifications-bar></wt-notifications-bar>
    <section class="auth-form-wrapper">
      <div class="auth-form-wrapper__content">
        <header class="auth-form-wrapper__header">
          <wt-logo
            :dark-mode="theme === 'dark'"
          />
          <wt-dark-mode-switcher />
        </header>
        <h1 class="auth-tabs-title">{{ currentTab.title }}</h1>
        <component
          :is="currentTab.value"
          :is-back-prev-step="isBackPrevStepInLogin"
          @update:is-back-prev-step="isBackPrevStepInLogin = false"
          @change-tab="currentTab = $event"
          @submit="authorization(currentTab.value)"
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

<script>
import '@egjs/vue3-flicking/dist/flicking.css';

import { AutoPlay,Pagination } from '@egjs/flicking-plugins';
import Flicking from '@egjs/vue3-flicking';
import WtDarkModeSwitcher from '@webitel/ui-sdk/src/modules/Appearance/components/wt-dark-mode-switcher.vue';
import { mapActions, mapState } from 'vuex';

import Login from './login/the-login.vue';
import Register from './register/the-register.vue';
import ChatsSlide from './slides/chats-slide.vue';
import ContactCenterSlide from './slides/contact-center-slide.vue';
import HistoryAndAnalyticsSlide from './slides/history-and-analytics-slide.vue';
import SupervisorSlide from './slides/supervisor-slide.vue';

export default {
  name: 'Auth',
  components: {
    HistoryAndAnalyticsSlide,
    ChatsSlide,
    SupervisorSlide,
    ContactCenterSlide,
    Login,
    Register,
    Flicking,
    WtDarkModeSwitcher,
  },
  data: () => ({
    currentTab: { value: 'login' },
    plugins: [
      new Pagination({ type: 'bullet' }),
      new AutoPlay({ duration: 9000, stopOnHover: false }),
    ],
    isBackPrevStepInLogin: false,
  }),
  computed: {
    ...mapState('appearance', {
      theme: (state) => state.theme,
    }),
    tabs() {
      return [
        {
          title: this.$t('auth.signIn'),
          text: this.$t('auth.login'),
          value: 'login',
        },
        {
          title: this.$t('auth.titleRegistration'),
          text: this.$t('auth.register'),
          value: 'register',
        },
      ];
    },
  },

  methods: {
    ...mapActions('auth', {
      submitAuth: 'SUBMIT_AUTH',
    }),
    setInnitialTab() {
      const loginTab = this.tabs.find(({ value }) => value === 'login');
      const registerTab = this.tabs.find(({ value }) => value === 'register');
      this.currentTab = this.$route.query.reset ? registerTab : loginTab;
    },
    async authorization(tab) {
      try {
        await this.submitAuth(tab)
      } catch (err) {
        if(tab === 'login' && err.code === 419) this.isBackPrevStepInLogin = true;
      }
    },
  },
  created() {
    this.setInnitialTab();
  },
};
</script>

<style lang="scss">
@import '../../assets/css/auth/auth';

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
      @extend %typo-heading-3;
      margin: var(--spacing-lg) auto;
      text-align: center;
    }
  }

  .logo {
    width: 88px;
  }

  .auth-form-header__title {
    @extend %typo-heading-2;
    margin-bottom: var(--spacing-sm);
  }

  .auth-form-header__subtitle {
    @extend %typo-body-1;
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
      background: url('../../assets/img/auth/background.svg') no-repeat;
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
    @extend %typo-heading-3;
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
