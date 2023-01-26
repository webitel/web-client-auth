<template>
  <main class="auth">
    <wt-notifications-bar></wt-notifications-bar>
    <section class="auth-form-block">
      <div class="auth-form-wrapper">
        <img alt="logo" class="logo" src="../../assets/img/logo-dark.svg">
        <header class="auth-form-header">
          <h2 class="auth__title">{{ computeTitle }}</h2>
          <p class="auth__subtitle">{{ $t('auth.detailsSubtitle') }}</p>
        </header>
        <div class="auth-tab__wrap">
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
        <agile
          :autoplay-speed="60000"
          :nav-buttons="false"
          :speed="500"
          autoplay
          infinite
          pause-on-dots-hover
          pause-on-hover
        >
          <div
            v-for="(item, key) in carouselItems"
            :key="key"
            class="slide"
          >
            <div class="item-wrap">
              <div class="item">
                <h3 class="item-header">
                  {{ item.titleStart }}
                  <strong class="item-header__strong">
                    {{ item.titleStrong }}
                  </strong>
                  {{ item.titleEnd }}
                </h3>
                <p class="item-text">
                  {{ item.text }}
                </p>
              </div>
              <img alt="pic" class="item-bg" src="../../assets/img/auth/bg1.svg">
            </div>
          </div>
        </agile>
      </div>
      <img
        alt="pic"
        class="auth-info__background"
        src="../../assets/img/auth/background.svg"
      >
    </section>
  </main>
</template>

<script>
import { VueAgile } from 'vue-agile';
import Login from './the-login';
import Register from './the-register';

export default {
  name: 'auth',
  components: {
    Login,
    Register,
    agile: VueAgile,
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
      carouselItems: [
        {
          titleStart: 'New agent',
          titleStrong: 'group ',
          titleEnd: 'work module',
          text: 'The most efficient call distribution. An agent can have several skills at once for participating in different campaigns. The client is served only by professionals.',
        },
        {
          titleStart: 'New agent',
          titleStrong: 'group ',
          titleEnd: 'work module',
          text: 'The most efficient call distribution. An agent can have several skills at once for participating in different campaigns. The client is served only by professionals.',
        },
        {
          titleStart: 'New agent',
          titleStrong: 'group ',
          titleEnd: 'work module',
          text: 'The most efficient call distribution. An agent can have several skills at once for participating in different campaigns. The client is served only by professionals.',
        },
        {
          titleStart: 'New agent',
          titleStrong: 'group ',
          titleEnd: 'work module',
          text: 'The most efficient call distribution. An agent can have several skills at once for participating in different campaigns. The client is served only by professionals.',
        },
        // {
        //     title: this.$t('auth.carousel.title2'),
        //     text: this.$t('auth.carousel.text2'),
        // },
        // {
        //     title: this.$t('auth.carousel.title3'),
        //     text: this.$t('auth.carousel.text3'),},
        // {
        //     title: this.$t('auth.carousel.title4'),
        //     text: this.$t('auth.carousel.text4'),},
        // {
        //     title: this.$t('auth.carousel.title5'),
        //     text: this.$t('auth.carousel.text5'),},
        // {
        //     title: this.$t('auth.carousel.title6'),
        //     text: this.$t('auth.carousel.text6'),
        // },
      ],
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
$width-form-lg: 528px;
$width-form-md: 384px;
$width-form-sm: 576px;

.auth {
  display: flex;
  min-height: 100vh;
  background: var(--page-bg-color);
  position: relative;
  overflow: hidden;

  .auth-form-block {
    position: relative;
    background: $content-bg-color-2;
    z-index: 2;
    display: flex;
    align-items: center;
    flex-basis: $width-form-lg;
    //overflow: auto;

    @media (max-width: $breakpoint-md) {
      flex-basis: $width-form-md;
    }

    @media (max-width: $breakpoint-sm) {
      margin: var(--spacing-md) 0;
      flex-basis: $width-form-sm;
    }

    @media (max-width: $breakpoint-xs) {
      margin: var(--spacing-sm) 0;
      width: 100%;
    }
  }

  .auth-form-wrapper {
    padding: 0 var(--spacing-3xl);
    width: 100%;

    @media (max-width: $breakpoint-md) {
      padding: var(--spacing-lg);
    }

    @media (max-width: $breakpoint-xs) {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--spacing-sm);
    }
  }

  .logo {
    display: none;
    width: 60px;

    @media (max-width: $breakpoint-xs) {
      display: block;
      margin-bottom: var(--spacing-xs);
    }
  }

  .auth__title {
    @extend %typo-heading-2;
    margin-bottom: var(--spacing-sm);

    @media (max-width: $breakpoint-xs) {
      // @extend %typo-heading-3
      // link to stackoverflow issue
      font-size: 20px;
      font-weight: 600;
      line-height: 32px;
      text-align: center;
      margin-bottom: var(--spacing-xs);
    }
  }

  .auth__subtitle {
    @extend %typo-body-1;
    margin-bottom: var(--spacing-sm);

    @media (max-width: $breakpoint-xs) {
      margin-bottom: var(--spacing-xs);
      text-align: center;
    }
  }

  .auth-tab__wrap {
    box-sizing: border-box;
    padding: var(--spacing-sm);
    background: var(--main-color);
    border-radius: var(--border-radius);
    width: 100%;

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
    position: relative;
    flex-grow: 1;
    min-width: 0;
    color: $content-bg-color;
    //background: $sidebar-color;

    @media (max-width: $breakpoint-sm) {
      flex-grow: initial;
    }

    @media (max-width: $breakpoint-xs) {
      display: none;
    }

    &__background {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 0;
      min-height: 100%;
    }
  }

  .carousel-wrap {
    display: none;
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;

    @media (max-width: $breakpoint-xs) {
      display: none;
    }

    .agile {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 100%;

      &__list {
        height: 100%;

        .agile__track, .slide {
          height: 100%;
        }
      }

      &__actions {
        position: absolute;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        /*margin: 150px auto 0;*/
        /*display: block;*/
      }
    }

    .item-wrap {
      position: relative;
      display: flex;
      flex-direction: column-reverse;
      width: 100%;
      height: 100%;

      .item {
        display: flex;
        margin: 0 0 228px 93px;
      }

      .item-header {
        @extend %typo-heading-1;

        width: min-content;
        width: -moz-min-content;
        margin: 0 46px 0 0;
        font-family: 'EN-AvantGardeDemi', 'RU-AvantGardeDemi', sans-serif;
        font-size: 50px;
        line-height: 1;
        text-align: right;
        text-transform: uppercase;
        color: $accent-color;
        /*margin-bottom: 44px;*/

        &__strong {
          position: relative;
          display: inline-block;
          color: $label-color;

          &:before {
            position: absolute;
            z-index: -1;
            top: -20px;
            right: -15px;
            bottom: -5px;
            left: -15px;
            content: '';
            background: #EB5757;
          }
        }

      }

      .item-text {
        @extend %typo-body-1;
        width: 300px;
        min-width: 250px;
        max-width: 500px;
        max-height: 200px;
        margin: 0;
        font-family: 'Montserrat', monospace;
        font-size: 18px;
        line-height: 1.8;
      }

      .item-bg {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }

    .agile__dot {
      margin: 0 6px;

      button {
        display: block;
        width: 10px;
        height: 10px;
        margin: 0;
        padding: 0;
        cursor: pointer;
        transition-duration: .3s;
        font-size: 0;
        line-height: 0;
        border: none;
        border-radius: 50%;
        background: $content-bg-color;
      }

      &--current button, &:hover button {
        background: $accent-color;
      }
    }
  }

  @media (max-width: $breakpoint-sm) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
