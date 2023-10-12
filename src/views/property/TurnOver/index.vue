<template>
  <Wrapper :title="title">
    <!-- <HeadSearch></HeadSearch> -->
    <TableHome></TableHome>
  </Wrapper>
</template>
<script>
import Wrapper from "@/components/wrapper";
import TableHome from "./ui/TableHome.vue";
export default {
  components: {
    Wrapper,
    TableHome,
  },
  data() {
    return {
      message: "Hello from parent!",
      title: "",
    };
  },
  mounted() {
    this.title = this.$route.meta.title;
  },
  computed: {},
  methods: {
    goDetails() {
      this.$router.push("/property/purchase/annualDetails");
    },
    goAdd() {
      this.$router.push("/property/purchase/annualAdd");
    },
  },
};
</script>
<style lang="scss" scoped>
.submit {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
