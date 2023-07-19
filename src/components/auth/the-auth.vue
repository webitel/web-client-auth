<template>
  <main
    class="auth"
    :class="{ 'auth--xs': $breakpoint.xsOnly }"
  >
    <wt-notifications-bar></wt-notifications-bar>
    <section class="auth-form-wrapper">
      <div class="auth-form-wrapper__content">
        <div class="auth-tabs-wrap">
          <img alt="logo" class="logo" src="../../assets/img/logo-dark.svg">
          <h1 class="auth-tabs-title">{{ tabTitle }}</h1>
          <component
            :is="currentTab.value"
            @change-tab="currentTab = $event"
          />
        </div>
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
          ></contact-center-slide>
          <supervisor-slide
            key="2"
            class="card-panel"
          ></supervisor-slide>
          <chats-slide
            key="3"
            class="card-panel"
          ></chats-slide>
          <history-and-analytics-slide
            key="4"
            class="card-panel"
          ></history-and-analytics-slide>
          <template v-slot:viewport>
            <div class="flicking-pagination"></div>
          </template>
        </flicking>
      </div>
      <img alt="logo" class="auth-info__logo" src="../../assets/img/logo-light.svg">
      <div class="auth-info__background"></div>
    </section>
  </main>
</template>

<script>
import Login from './the-login';
import Register from './the-register';
import ContactCenterSlide from '@/components/auth/slides/contact-center-slide';
import ChatsSlide from '@/components/auth/slides/chats-slide';
import HistoryAndAnalyticsSlide from '@/components/auth/slides/history-and-analytics-slide';
import SupervisorSlide from '@/components/auth/slides/supervisor-slide';
import Flicking from '@egjs/vue3-flicking';
import '@egjs/vue3-flicking/dist/flicking.css';
import { Pagination, AutoPlay } from '@egjs/flicking-plugins';

export default {
  name: 'auth',
  components: {
    HistoryAndAnalyticsSlide,
    ChatsSlide,
    SupervisorSlide,
    ContactCenterSlide,
    Login,
    Register,
    Flicking,
  },
  data() {
    return {
      currentTab: { value: 'login' },
      tabs: [
        {
          text: this.$t('vocabulary.login'),
          value: 'login',
        },
        {
          text: this.$t('auth.register'),
          value: 'register',
        },
      ],
      plugins: [
        new Pagination({ type: 'bullet' }),
        new AutoPlay({ duration: 9000, stopOnHover: false }),
      ],
    };
  },
  computed: {
    tabTitle() {
      if(this.currentTab.value === 'login') return this.$t('auth.signIn');
      if(this.currentTab.value === 'register') return this.$t('auth.titleRegistration');
    }
  },

  methods: {
    setInnitialTab() {
      const loginTab = this.tabs.find(({ value }) => value === 'login');
      const registerTab = this.tabs.find(({ value }) => value === 'register');
      this.currentTab = this.$route.query.reset ? registerTab : loginTab;
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
  min-height: 100vh;
  background: var(--page-bg-color);

  .auth-form-wrapper {
    position: relative;
    z-index: 2;
    display: flex;
    flex: 0 0 $form-width-lg;
    background: var(--page-bg-color);
  }

  .auth-form-wrapper__content {
    width: 100%;
    padding: var(--spacing-3xl);
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

  .auth-tabs-wrap {
    box-sizing: border-box;
    width: 100%;
    padding: var(--spacing-lg);
    background: var(--main-color);
    border-radius: var(--border-radius);

    .auth-tabs-title {
      @extend %typo-heading-3;
      margin: var(--spacing-lg) auto;
      text-align: center;
    }
  }

  .auth-info {
    flex-grow: 1;
    min-width: 0;
    color: var(--main-color);

    &__background {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 0;
      min-height: 100%;
      min-width: 100%;
      height: 1080px;
      width: 1920px;
      background: url('../../assets/img/auth/background.png') no-repeat;
      background-size: cover;
    }

    &__logo {
      position: absolute;
      right: 96px;
      top: 48px;
      width: 60px;
      z-index: 1;
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
      padding: var(--spacing-lg);
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
    }

    .logo {
      display: block;
      margin-bottom: var(--spacing-sm);
    }

    .auth-info {
      flex-grow: initial;

      &__logo {
        display: none;
      }
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
      margin: var(--spacing-sm) 0;
    }

    .auth-form-wrapper__content {
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: var(--spacing-sm);
    }

    .logo {
      margin-bottom: var(--spacing-xs);
    }

    .auth-form-header__subtitle {
      margin-bottom: var(--spacing-xs);
      text-align: center;
    }

    .auth-tabs-wrap {
      padding: var(--spacing-xs);

      .wt-tabs {
        padding: var(--spacing-xs);
      }
    }

    .auth-info {
      position: relative;
      display: none;
    }
  }
}

</style>
