<template>
  <div class="app-container">
    <div>
      <el-select v-model="params.status" placeholder="任务状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in taskType" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-tag size="Default" type="info">已完成 {{countTaskNum.success}}</el-tag>
      <el-tag size="Default" type="warning">未完成 {{countTaskNum.produces}}</el-tag>
      <el-tag size="Default" type="danger">已失败 {{countTaskNum.fail}}</el-tag>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row :default-sort ="{prop:'order',order:'ascending'}">
      <!--      <el-table-column type="selection" width="30" />@selection-change="handleSelectionChange" -->
      <el-table-column align="center" label="任务ID" width="100" sortable  prop="order">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="视频ID" width="110">
        <template slot-scope="scope">
          {{ scope.row.videoId }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务数量" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.taskTotal }}
        </template>
      </el-table-column>
      <el-table-column label="完成数量" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.taskCount }}
        </template>
      </el-table-column>
      <el-table-column label="价格" width="50" align="center">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="任务状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{
            scope.row.status == 0 ? "0-新创建"
            :scope.row.status == 1?"1-已完成"
            :scope.row.status == 2?"2-处理中"
            :scope.row.status == 3?"3-超时":""
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="170">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="截止日期" width="170">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.expireTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="完成日期" width="170">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.finishTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.type ==0?"0-点赞":"1-关注"}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon-color="red" title="确定要是删除任务?"
            @onConfirm="confirmEvent(scope.row.id)" @onCancel="cancelEvent">
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
        <!--        <template>
          <el-popover v-model:visible="visible" placement="top" :width="100">
            <p>确定删除任务?</p>
            <div style="text-align: center  ">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="visible = false;;confirmEvent(scope.row.id)">确认
              </el-button>
            </div>
            <template #reference>
              <el-button @click="visible = true">删除</el-button>
            </template>
          </el-popover>
        </template> -->
      </el-table-column>

    </el-table>
    <div class="demo-pagination-block" v-loading="listLoading">
      <el-pagination v-model="pageInfo" :total="pageInfo.total" :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {
    getList,
    delRow,
    countTask
  } from "@/api/table";
  const taskType = [{
      key: null,
      display_name: "全部",
    },
    {
      key: 0,
      display_name: "新创建",
    },
    {
      key: 1,
      display_name: "已完成",
    },
    {
      key: 2,
      display_name: "处理中",
    },
    {
      key: 3,
      display_name: "任务失败",
    },
  ];

  const calendarTypeKeyValue = taskType.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name;
    return acc;
  }, {});

  export default {
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: "gray",
          1: "success",
          2: "gray",
          3: "danger",
        };
        return statusMap[status];
      },
    },
    data() {
      return {
        visible: false,
        list: null,
        pageInfo: {
          pageSize: 5,
          pageNum: 1,
          total: 0,
        },
        // chPageNum: pageInfo.pageNum,
        // chpageSize: pageInfo.pageSize,
        listLoading: true,
        rowid: -1,
        countTaskNum: {
          fail: 0,
          produces: 0,
          success: 0
        },
        params: {
          pageSize: 8,
          pageNum: 1,
          status: null,
        },
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: "+id",
        },
        taskType: taskType,
      };
    },
    watch: {
      params: {
        handler(val, oval) {
          this.fetchData();
          this.countTask();
        },
        deep: true
      },
    },
    created() {
      this.fetchData();
      this.getCount();
    },
    methods: {
      fetchData() {
        this.listLoading = true;
        getList(this.params).then((response) => {
          this.pageInfo = response.data;
          // console.log(this.pageInfo.total);
          this.list = response.data.list;
          // console.log(this.list);
          this.listLoading = false;
        });
      },
      getCount() {
        countTask().then((response) => {
          this.countTaskNum.fail = response.data.fail;
          this.countTaskNum.success = response.data.success;
          this.countTaskNum.produces = response.data.produces;
        })
      },
      handleSizeChange(val) {
        this.params.pageSize = val;
      },
      handleCurrentChange(val) {
        this.params.pageNum = val;
      },
      handleDelete(index, row) {
        console.log(index, row)
      },
      cancelEvent() {
        console.log('cancel!')
      },
      confirmEvent(row) {
        this.rowid = row;
        delRow(this.rowid).then((response) => {
          if (response.code === 1) {
            this.$message('任务删除成功!')
            this.fetchData();
          } else {
            this.$message('任务删除失败!')
          }
        });

      }
    },
  };
</script>
