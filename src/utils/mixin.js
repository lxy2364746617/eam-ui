export default  {
    mounted(){
        this.hasRouter()
    },
  methods:{
      hasRouter(menuId){
          if(menuId){
            console.log(menuId)
          }
      }
  }  
}