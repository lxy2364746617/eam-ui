<template>
  <Wrapper :title="title">
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
      title: "",
    };
  },
  mounted() {
    this.title = this.$route.meta.title;
  },
  computed: {},
  methods: {},
};
</script>
    
    <style lang="scss" scoped>
.submit {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>