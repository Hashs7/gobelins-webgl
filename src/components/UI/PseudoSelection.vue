<template>
  <transition
      @enter="enter"
  >
    <div @keyup.enter="validatePseudo" v-if="qualitySet && !storePseudo" class="pseudo-selection" ref="container">
      <div class="quality-selection__box">
        <div class="quality-selection__header">
          <h1 class="quality-selection__title">Quel est votre pseudo ?</h1>
          <Chevron class="quality-selection__chevron" />
        </div>
        <div class="pseudo-selection__container" ref="pseudo">
          <input class="pseudo-selection__input" type="text" v-model="pseudo" placeholder="Pseudo" data-hover="big">
          <Outline class="pseudo-selection__outline" />
        </div>
      </div>

      <button class="btn-validate" @click="validatePseudo" data-hover="big" data-click="disapear">
        <span>Valider</span>
        <Arrow class="btn-validate__arrow"/>
      </button>
    </div>
  </transition>
</template>

<script>
  import Chevron from '@/assets/icons/chevron.svg';
  import Arrow from '@/assets/icons/arrow.svg';
  import Outline from '@/assets/icons/pseudo.svg';
  import gsap from 'gsap';

  export default {
    name: 'PseudoSelection',
    components: {
      Chevron,
      Arrow,
      Outline,
    },
    data() {
      return {
        pseudo: null,
      }
    },
    computed: {
      qualitySet() {
        return this.$store.state.quality;
      },
      storePseudo() {
        return this.$store.state.pseudo;
      },
      isPlaying() {
        return this.$store.state.isPlaying;
      }
    },
    watch: {
      pseudo(newValue, oldValue) {
        if (newValue.length < 10) return;
        this.pseudo = oldValue;
      }
    },
    methods: {
      enter(el, done) {
        gsap.to(this.$refs.container, {
          opacity: 1,
          duration: .5,
          onComplete: () => {
            done()
          },
        });
      },
      leave(el, done) {
        gsap.to(this.$refs.container, {
          opacity: 0,
          duration: .5,
          onComplete: () => {
            done()
          },
        });
      },
      validatePseudo() {
        this.$store.commit('setPseudo', this.pseudo);
        if (this.pseudo) return;
        const tl = gsap.timeline({ yoyo: true, repeat: 3 });
        tl.to(this.$refs.pseudo, {
          x: 10,
          duration: .1,
        });
        tl.to(this.$refs.pseudo, {
          x: -10,
          duration: .1,
        });
      }
    },
  }
</script>

<style lang="scss" scoped>
  .pseudo-selection {
    opacity: 0;
  }

  .btn-validate {
    position: absolute;
    bottom: 80px;
    right: 120px;
    color: $white;
    font-size: 30px;
    font-family: $font-primary;
    text-transform: uppercase;
  }

  .btn-validate__arrow {
    margin-left: 10px;
    width: 44px;
  }

  .pseudo-selection__container {
    position: relative;
    width: 320px;
    margin: 16px auto 0 auto;
  }

  .pseudo-selection__input {
    cursor: none;
    width: 100%;
    font-family: $font-pseudo;
    font-size: 42px;
    text-align: center;
    color: $white;
    padding-bottom: 20px;

    &::placeholder {
      font-family: $font-pseudo;
      font-size: 42px;
      color: $white;
      opacity: .5;
    }
  }

  .pseudo-selection__outline {
    pointer-events: none;
    position: absolute;
    bottom: 4px;
    left: 0;
    right: 0;
    margin: auto;
  }
</style>