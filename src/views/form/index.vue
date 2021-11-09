<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="视频ID">
        <el-input v-model="form.videoId" />
      </el-form-item>
      <el-form-item label="视频作者ID">
        <el-input v-model="form.uid" />
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="form.type" placeholder="选择任务类别">
          <el-option label="点赞" value="0" />
          <el-option label="关注" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="任务数量">
        <el-input v-model="form.taskTotal" />
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="form.price" />
      </el-form-item>
      <el-form-item label="任务到期时间">
        <div class="block">
          <el-date-picker v-model="form.expireTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择到期时间">
          </el-date-picker>
        </div>
      </el-form-item>
      <!--      <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery" />
      </el-form-item> -->
      <!--      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>-->
      <el-form-item label="备注">
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建任务</el-button>
        <el-button @click="onCancel">取消提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    data() {
      return {
        form: {
          videoId: '',
          type: '',
          taskTotal: '',
          price: '',
          expireTime: '',
          account:'',
          uid:'',
          // type: [],
          // resource: '',
          description: ''
        }
      }
    },
    methods: {
      // createTask(params) {
      //   return request({
      //     url: '/task/insOne',
      //     method: 'post',
      //     params: params
      //   })
      // },
      onSubmit() {
        this.form.account = this.name;
        request({
          url: '/api/task/insOne',
          method: 'post',
          params: this.form
        }).then((response) => {
          let status = response.code;
          console.log(status)
          if (status == 201) {
            this.$message('任务创建成功!')
          } else {
            this.$message('任务创建失败,请检查参数!' + response.msg)
          }
        });
      },
      onCancel() {
        this.$message({
          message: '您已取消提交!',
          type: 'warning'
        })
      },
    }
  }
</script>

<style scoped>
  .line {
    text-align: center;
  }
</style>
