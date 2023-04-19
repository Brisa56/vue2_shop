<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-button
          type="primary"
          @click="showAddCateDiaglog"
        >添加分类</el-button>
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        class="treeTable"
        show-index
        index-text="#"
        :expand-type="false"
        :selection-type="false"
        :data="catelist"
        :columns="columns"
        border
        :show-row-hover="false"
      >
        <!-- 模板-是否有效 -->
        <template
          slot="isok"
          slot-scope="scope"
        >
          <i
            style="color:lightgreen"
            v-if="scope.row.cat_deleted==false"
            class="el-icon-success"
          ></i>
          <i
            style="color:red"
            v-else
            class="el-icon-error"
          ></i>
        </template>
        <!-- 模板-排序 -->
        <template
          slot="order"
          slot-scope="scope"
        >
          <el-tag
            v-if="scope.row.cat_level==0"
            size="mini"
          >一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level==1"
            type="success"
            size="mini"
          >二级</el-tag>
          <el-tag
            v-else
            type="warning"
            size="mini"
          >三级</el-tag>
        </template>
        <!-- 模板-编辑 -->
        <template
          slot="opt"
          slot-scope="scope"
        >
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item
          label="分类名称："
          prop="cat_name"
        >
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 级联下拉框 -->
          <!-- options 指定数据源-->
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>

      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addCate"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类的数据列表，默认为空
      catelist: [],
      //总数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          //将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用的模板名称
          template: 'isok',
        },
        {
          label: '排序', //将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用的模板名称
          template: 'order',
        },
        {
          label: '操作', //将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用的模板名称
          template: 'opt',
          width: '300px',
        },
      ],
      //控制添加对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加用户表单的数据
      addCateForm: {
        //分类名称
        cat_name: '',
        //父级分类ID（默认写为0，也就是一级分类）
        cat_pid: 0,
        //分类等级,默认要添加的是1级分类
        cat_level: 0,
      },
      //添加分类的表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur',
          },
        ],
      },
      //父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: 'true',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //选中的父级分类的Id数组
      selectedKeys: [],
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类失败')
      // 赋值
      this.catelist = res.data.result
      this.total = res.data.total
    },
    //监听 pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    //监听 pagenum 的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    //点击按钮，显示添加分类的对话框
    showAddCateDiaglog() {
      //获取父级分类的列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取父级分类列表失败')
      this.parentCateList = res.data
    },
    //选择项发生变化触发这个函数
    parentCateChanged() {
      // 如果this.selectedKeys.length>0证明选中了父级分类
      if (this.selectedKeys.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        //为当前分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        //父级分类的id
        this.addCateForm.cat_pid = 0
        //为当前分类的等级
        this.addCateForm.cat_level = 0
      }
    }, //点击确认触发添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        // console.log(this.addCateForm)
        const { data: res } = await this.$http.post('categories', 
          this.addCateForm,
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }

        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    //监听添加分类对话框的关闭事件
    addCateDialogClosed() {
      //清空
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
  },
}
</script>

<style>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>