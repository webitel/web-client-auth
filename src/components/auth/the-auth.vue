<template>
  <main class="auth">
    <wt-notifications-bar></wt-notifications-bar>
    <section class="auth-form-wrapper">
      <div class="auth-form-wrapper__content">
        <img alt="logo" class="logo" src="../../assets/img/logo-dark.svg">
        <header class="auth-form-header">
          <h2 class="auth-form-header__title">{{ computeTitle }}</h2>
          <p class="auth-form-header__subtitle">{{ $t('auth.detailsSubtitle') }}</p>
        </header>
        <div class="auth-tabs-wrap">
          <wt-tabs
            v-model="currentTab"
            :tabs="tabs"
          ></wt-tabs>
          <component
            :is="currentTab.value"
          ></component>
        </div>
      </div>
    </section>
    <section class="auth-info">
      <div class="carousel-wrap">
        <flicking :options="{ circular: true }" :plugins="plugins">
            <contact-center-slide class="card-panel"></contact-center-slide>
            <supervisor-slide class="card-panel"></supervisor-slide>
            <chats-slide class="card-panel"></chats-slide>
            <history-and-analytics-slide class="card-panel"></history-and-analytics-slide>
            <div slot="viewport" class="flicking-pagination"></div>
        </flicking>
      </div>
      <img alt="logo" class="auth-info__logo" src="../../assets/img/logo-light.svg">
      <div class="auth-info__background"></div>
    </section>
  </main>
</template>

<script>
import { VueAgile } from 'vue-agile';
import Login from './the-login';
import Register from './the-register';
import ContactCenterSlide from "@/components/auth/slides/contact-center-slide";
import ChatsSlide from '@/components/auth/slides/chats-slide';
import HistoryAndAnalyticsSlide from '@/components/auth/slides/history-and-analytics-slide';
import SupervisorSlide from '@/components/auth/slides/supervisor-slide';
import { Flicking } from "@egjs/vue-flicking";
import { Pagination, AutoPlay } from "@egjs/flicking-plugins";

export default {
  name: 'auth',
  components: {
    HistoryAndAnalyticsSlide,
    ChatsSlide,
    SupervisorSlide,
    ContactCenterSlide,
    Login,
    Register,
    agile: VueAgile,
    flicking: Flicking,
  },
  data() {
    return {
      currentTab: { value: 'login' },
      tabs: [
        {
          text: this.$t('auth.login'),
          value: 'login',
        },
        {
          text: this.$t('auth.register'),
          value: 'register',
        },
      ],
      plugins: [new Pagination({ type: 'bullet' })],
    };
  },

  computed: {
    computeTitle() {
      return this.currentTab.value === 'login' ?
        this.$t('auth.login') : this.$t('auth.register');
    },
  },
  methods: {
    setInnitialTab() {
      this.currentTab.value = this.$route.query.reset ? 'register' : 'login';
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

.auth {
  position: relative;
  display: flex;
  overflow: hidden;
  min-height: 100vh;
  background: var(--page-bg-color);

  @media (max-width: $breakpoint-md) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: $breakpoint-xs) {
    align-items: normal;
  }

  .auth-form-wrapper {
    position: relative;
    z-index: 2;
    display: flex;
    flex: 0 0 $form-width-lg;
    background: var(--page-bg-color);

    @media (max-width: $breakpoint-lg) {
      flex: 0 0 $form-width-md;
    }

    @media (max-width: $breakpoint-md) {
      flex: 0 0 $form-width-sm;
      border-radius: var(--border-radius);
    }

    @media (max-width: $breakpoint-xs) {
      width: 100%;
      margin: var(--spacing-sm) 0;
    }
  }

  .auth-form-wrapper__content {
    width: 100%;
    padding: var(--spacing-3xl);

    @media (max-width: $breakpoint-lg) {
      padding: var(--spacing-lg);
    }

    @media (max-width: $breakpoint-xs) {
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: var(--spacing-sm);
    }
  }

  .logo {
    display: none;
    width: 60px;

    @media (max-width: $breakpoint-md) {
      display: block;
      margin-bottom: var(--spacing-sm);
    }

    @media (max-width: $breakpoint-xs) {
      margin-bottom: var(--spacing-xs);
    }
  }

  .auth-form-header__title {
    @extend %typo-heading-2;
    margin-bottom: var(--spacing-sm);

    @media (max-width: $breakpoint-xs) {
      // @extend %typo-heading-3
      // link to stackoverflow issue
      // https://stackoverflow.com/questions/14840918/extending-selectors-from-within-media-queries-with-sass
      font-size: 20px;
      font-weight: 600;
      line-height: 32px;
      text-align: center;
      margin-bottom: var(--spacing-xs);
    }
  }

  .auth-form-header__subtitle {
    @extend %typo-body-1;
    margin-bottom: var(--spacing-sm);

    @media (max-width: $breakpoint-xs) {
      margin-bottom: var(--spacing-xs);
      text-align: center;
    }
  }

  .auth-tabs-wrap {
    box-sizing: border-box;
    width: 100%;
    padding: var(--spacing-sm);
    border-radius: var(--border-radius);
    background: var(--main-color);

    @media (max-width: $breakpoint-xs) {
      padding: var(--spacing-xs);
    }

    .wt-tabs {
      margin-bottom: var(--spacing-sm);
      padding: var(--spacing-sm);

      @media (max-width: $breakpoint-xs) {
        padding: var(--spacing-xs);
      }
    }
  }

  .auth-info {
    flex-grow: 1;
    min-width: 0;
    color: var(--main-color);

    @media (max-width: $breakpoint-md) {
      flex-grow: initial;
      //position: initial;
    }

    @media (max-width: $breakpoint-xs) {
      position: relative;
      display: none;
    }

    &__background {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 0;
      min-height: 100%;
      min-width: 100%;
      background: url("../../assets/img/auth/background.svg") no-repeat;
      background-size: cover;
    }

    &__logo {
      position: absolute;
      right: 96px;
      top: 48px;
      width: 60px;
      z-index: 1;

      @media (max-width: $breakpoint-md) {
        display: none;
      }
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

    @media (max-width: $breakpoint-md) {
      display: none;
    }

    .flicking-viewport {
      overflow: visible;
    }

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
      left: 0;
      bottom: 0;
    }
  }
}
</style>
