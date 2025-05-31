<script setup>
const config = useRuntimeConfig();

const { restAPI } = useApi();

const { route } = useRouter();
const path = (route.path.split("/").filter(Boolean).pop() || "").toString();

const { data: resDataDetail } = await restAPI.stores.getStoreProductDetail(
  path
);
const productDetail = resDataDetail.value.data ?? {};

if (isObjectNullOrEmpty(productDetail)) {
  useHead({
    title: "404 - Not Found",
  });
} else {
  useHead({
    title: productDetail?.metadata?.meta_title || productDetail?.name,
    link: [{ ref: "canonical", href: config.public.domainUrl + route.path }],
  });
  useSeoMeta({
    title: productDetail?.metadata?.meta_title || productDetail?.name,
    description:
      productDetail?.metadata?.meta_description || productDetail?.description,
    keywords: productDetail?.metadata?.meta_keywords,
    ogUrl: config.public.domainUrl + route.path,
    ogLocale: "vi_VN",
    ogType: "website",
    ogImage:
      productDetail?.metadata?.meta_images?.[0]?.src ||
      productDetail?.thumb_image?.[0]?.src ||
      productDetail?.feature_image,
  });
}
</script>
<template>
  <div class="">
    <div v-if="isObjectNullOrEmpty(productDetail)">
      <PageNotAvailable />
    </div>
    <div v-else class="md:mt-[30px] mt-3">
      <ProductsDetail :productDetail="productDetail" class="width-product" />
      <!-- <NewsCategoryDetail class="width-product mt-[134px]" /> -->
      <ViewedProducts class="width-base" />
      <Advantage class="width-base mt-[100px]" />
      <FAQ />
      <Partner class="width-base" />
      <News class="width-base" />
    </div>

  </div>
</template>

<style>
.width-product {
  max-width:1080px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
@media (min-width: 1700px) {
  .width-product {
    max-width: 1230px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>