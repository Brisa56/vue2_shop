<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-col>
        <el-button
          @click="addDialogVisible=true"
          type="primary"
        >添加角色</el-button>
      </el-col>
      <!-- 角色列表区域 -->
      <el-table
        :data="roleList"
        stripe
        style="width: 100%"
        border
      >
        <el-table-column type='expand'>
          <template slot-scope="scope">
            <el-row
              :class="[i1==0 ? 'bdtop':'', 'bdbottom', 'vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                >{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2==0 ? '':'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success"
                    >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      :class="[i3==0 ? '':'bdtop']"
                      v-for="(item3,i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="300px"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="showEditDialog(scope.row.id)"
              icon="el-icon-search"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="removeRoleById(scope.row.id)"
              icon="el-icon-delete"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addRole"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色的对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editRoleInfo"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 分配权限主体区域（树形控件） -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defCheckedKeys"
      >
      </el-tree>

      <!-- 分配权限底部区域 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="allotRights"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      //所有角色列表数据
      roleList: [],

      //添加角色对话框的显示设置
      addDialogVisible: false,
      //添加角色的表单数据
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      //添加角色的校验规则
      addFormRules: {},

      //编辑角色对话框的显示设置
      editDialogVisible: false,
      //编辑角色的表单数据
      editForm: {},
      //编辑角色的校验规则
      editFormRules: {},

      // 分配权限的对话框的显示设置
      setRightDialogVisible: false,
      // 所有权限列表
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      //默认被选中的结点id值数组
      defCheckedKeys: [],
      //当前即将分配权限的角色id
      roleId:'',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败')
      this.roleList = res.data
      // console.log(res.data)
    },
    //添加角色
    async addRole() {
      //可以发起真正添加用户的网络请求
      const { data: res } = await this.$http.post(`roles`, this.addForm) //与接口类型一致
      if (res.meta.status !== 201) return this.$message.error('添加角色失败！')
      //添加用户成功
      this.$message.success('添加角色成功！')
      // 隐藏输入框
      this.addDialogVisible = false
      // 更新列表
      this.getRolesList()
    },
    //监听添加角色对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },

    //展示编辑角色的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200)
        return this.$message.error('查询角色数据失败!')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //编辑用户
    async editRoleInfo() {
      const { data: res } = await this.$http.put(
        `roles/` + this.editForm.roleId,
        {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc,
        }
      )
      //与接口类型一致
      if (res.meta.status !== 200) return this.$message.error('更新角色失败！')
      //添加用户成功
      this.$message.success('更新角色成功！')
      // 隐藏输入框
      this.editDialogVisible = false
      // 更新列表
      this.getRolesList()
    },
    //监听添加角色对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    //删除角色
    async removeRoleById(id) {
      // 询问用户是否删除的弹框
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      //用户点击确认，confirmResult==confirm
      //用户点击取消，报错(catch后变为cancel)

      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')

      //删除成功
      this.$message.success('删除用户成功')
      //重新渲染页面
      this.getRolesList()
    },
    //根据id删除对应权限
    async removeRightById(role, rightId) {
      //弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult !== 'confirm') return this.$message.info('取消删除')

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )

      if (res.meta.status !== 200) return this.$message.error('删除权限失败')

      this.$message.success('删除权限成功')

      //重新更新role而不是roleList，可以防止删除后，expand被关闭
      role.children = res.data
      // this.getRolesList()
    },
    //打开分配权限显示框
    async showSetRightDialog(role) {
      this.roleId= role.id
      //获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200)
        return this.$message.error('获取权限数据失败')
      //把获取到的权限数据保存到data中
      this.rightsList = res.data

      //获取三级节点的id
      this.getLeafKeys(role, this.defCheckedKeys)

      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defCheckedKeys数组中
    getLeafKeys(node, arr) {
      //三级节点
      if (!node.children) {
        //将该节点添加到数组中
        return arr.push(node.id)
      }
      //不是三级节点，则递归调用
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
      // this.$http.get('roles')
    },
    //监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      //关闭后，就要把这个默认选中框清空，不然打开另一个分配权限按钮时，会出现bug(没有的权限也被选中了)
      this.defCheckedKeys = []
    },
    //点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      const {data:res} = await this.$http.post( `roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status!==200)return this.$message.error('分配权限失败')

      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible=false
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>