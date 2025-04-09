\<template>
  <div class="flex flex-col min-h-screen">
    <Header :categories="categories" :class="{ 'hidden-header': isHeaderHidden }" class="fixed-header" />
    <div class="content bg-white min-h-[calc(100vh-677px)]">
      <slot />
    </div>
    <div id="zalo-vr" :class="zaloVrClass">
      <div
       @click="showModalZalo = true"
       class="flex flex-col items-center align-center min-w-[60px] cursor-pointer play" 
      >
      <div class="play_child">
          <MBotZalo class="pt-1.5" />
        </div>
      </div>
    </div>

  </div>
</template>