<template>
  <div class="reveal">
  <div class="slides">
      <section>
						<h2>Basement Level 1</h2>
						<p>Nested slides are useful for adding additional detail underneath a high level horizontal slide.</p>
      </section>
      <section>
						<h2>Basement Level 2</h2>
						<p>Nested slides are useful for adding additional detail underneath a high level horizontal slide.</p>
      </section>
      <section>
          <TwoSlider></TwoSlider>                  
      </section>
    </div>      
  </div>
  
</template>

<script>
import TwoSlider from './components/TwoSlider.vue'

export default {
  name: 'App',
  components: {
    TwoSlider
    //HelloWorld    
  },
}
</script>

<style>
#app {
  font-family: Poppins, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>