<template>
  <div class="app-container">
    <el-tabs :value="activeTabName" @tab-click="handleTabClick">
      <!-- 小程序列表 -->
      <el-tab-pane label="小程序列表" name="wxapps">
        <div class="filter-container">
          <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate"
            type="primary" v-waves icon="el-icon-edit">添加小程序</el-button>
        </div>
        <el-table :key="tableKey" :data="wxapps" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
          <el-table-column label="标题">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
              <el-tag v-if="scope.row.applyToBanner">Banner列表</el-tag>
              <el-tag v-if="scope.row.applyToList">List列表</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="描述">
            <template slot-scope="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>


          <el-table-column width="200" label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createAt | moment('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="300" label="操作" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="handleRemove(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-tab-pane>
      <!-- Banner排序 -->
      <el-tab-pane label="Banner排序" name="wxapp-of-banner">
        <div class="filter-container">
          <el-switch class="filter-item"
            v-model="bannerSortMode"
            active-text="拖拽排序模式"
            inactive-text="查看模式"
            @change="handleBannerAppsSort"
            >
          </el-switch>
          <el-button class="filter-item" style="margin-left: 10px;" @click="updateBannerAppsSort" v-if="bannerSortMode"
            type="primary" v-waves icon="el-icon-edit">保存更改</el-button>
        </div>
        <el-table :key="tableKey" :data="bannerWXApps" row-key="_id" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
          <el-table-column label="序号" width="80">
            <template slot-scope="scope">
              <span>#{{ scope.row.bannerIndex }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标题">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述">
            <template slot-scope="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="bannerSortMode" align="center" label="拖拽" width="80">
            <template slot-scope="scope">
              <svg-icon class='drag-handler' icon-class="drag"></svg-icon>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- List排序 -->
      <el-tab-pane label="List排序" name="wxapp-of-list">
        <div class="filter-container">
          <el-switch class="filter-item"
            v-model="listSortMode"
            active-text="拖拽排序模式"
            inactive-text="查看模式"
            @change="handleListAppsSort"
            >
          </el-switch>
          <el-button class="filter-item" style="margin-left: 10px;" @click="updateListAppsSort" v-if="listSortMode"
            type="primary" v-waves icon="el-icon-edit">保存更改</el-button>
        </div>
        <el-table :key="tableKey" :data="listWXApps" row-key="_id" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
          <el-table-column label="序号" width="80">
            <template slot-scope="scope">
              <span>#{{ scope.row.listIndex }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标题">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述">
            <template slot-scope="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="listSortMode" align="center" label="拖拽" width="80">
            <template slot-scope="scope">
              <svg-icon class='drag-handler' icon-class="drag"></svg-icon>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 应用创建/编辑对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="tempWXApp" status-icon label-position="left" label-width="180px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="标题"
          prop="title"
          :rules="[
            { type: 'string', required: true, message: '标题不能为空', trigger: 'change' }
          ]">
          <el-input v-model="tempWXApp.title"></el-input>
        </el-form-item>
        <el-form-item label="描述"
          prop="description"
          :rules="[
            { type: 'string', required: true, message: '描述不能为空', trigger: 'change' }
          ]">
          <el-input v-model="tempWXApp.description"></el-input>
        </el-form-item>
        <el-form-item label="AppId"
          prop="appid"
          :rules="[
            { type: 'string', required: true, message: 'AppId不能为空', trigger: 'change' }
          ]">
          <el-input v-model="tempWXApp.appid"></el-input>
        </el-form-item>

        <!--<el-form-item label="类型"-->
                      <!--prop="type"-->
                      <!--:rules="[-->
            <!--{ type: 'text', required: true, message: '类型不能为空', trigger: 'change' }-->
          <!--]">-->
          <!--<el-input v-model="tempWXApp.type"></el-input>-->
        <!--</el-form-item>-->

        <el-form-item label="是否携带路径" required>
          <el-switch v-model="tempWXApp.needPath"></el-switch>
        </el-form-item>
        <el-form-item label="打开的页面路径" v-if="tempWXApp.needPath"
          prop="path"
          :rules="[
            { type: 'string', required: true, message: '页面路径不能为空', trigger: 'change' }
          ]">
          <el-input v-model="tempWXApp.path"></el-input>
        </el-form-item>

        <el-form-item label="是否应用到Banner列表" required>
          <el-switch v-model="tempWXApp.applyToBanner"></el-switch>
        </el-form-item>
        <el-form-item
          label="Banner图"
          prop="banner"
          v-if="tempWXApp.applyToBanner"
          :rules="[
            { type: 'string', required: true, message: '请上传Banner图', trigger: 'blur' }
          ]">
          <el-upload
            class="image-uploader"
            action="action"
            :http-request="handleImageUpload"
            :show-file-list="false"
            :on-success="handleBannerImageSuccess"
            :before-upload="beforeImageUpload">
            <img v-if="tempWXApp.banner" :src="tempWXApp.banner" class="image">
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否应用到List列表" required>
          <el-switch v-model="tempWXApp.applyToList"></el-switch>
        </el-form-item>
        <el-form-item
          label="Icon图"
          prop="icon"
          v-if="tempWXApp.applyToList"
          :rules="[
            { type: 'string', required: true, message: '请上传Icon图', trigger: 'blur' }
          ]">
          <el-upload
            class="image-uploader"
            action="action"
            :http-request="handleImageUpload"
            :show-file-list="false"
            :on-success="handleIconImageSuccess"
            :before-upload="beforeImageUpload">
            <img v-if="tempWXApp.icon" :src="tempWXApp.icon" class="image">
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="ListItem背景色"
          prop="backgroundColor"
          v-if="tempWXApp.applyToList">
          <el-color-picker v-model="tempWXApp.backgroundColor"></el-color-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createApp">确认</el-button>
        <el-button v-else type="primary" @click="updateApp">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.image-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.image-uploader .el-upload:hover {
  border-color: #409EFF;
}

.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 350px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.image-uploader-icon.rule {
  width: 350px;
  height: 525px;
  line-height: 525px;
}
.image-uploader-icon.share {
  width: 250px;
  height: 200px;
  line-height: 200px;
}
.image {
  width: 350px;
  height: 150px;
  display: block;
}
.image.rule {
  width: 350px;
  height: 525px;
  display: block;
}
.image.share {
  width: 250px;
  height: 200px;
  display: block;
}
</style>

<script>
import { fetchListByPage, fetchListByType, createApp, updateBannerIndex, updateListIndex, updateApp, removeApp } from '@/api/app'
import { getUploadToken } from '@/api/qiniu'
import waves from '@/directive/waves' // 水波纹指令
import { upload } from './upload'
import Sortable from 'sortablejs'

export default {
  name: 'app',
  directives: {
    waves
  },
  data() {
    return {
      activeTabName: 'wxapps',
      tableKey: 0,
      wxapps: null,
      total: null,
      bannerWXApps: null,
      listWXApps: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      tempWXApp: {
        id: undefined,
        appid: undefined,
        needPath: false,
        path: undefined,
        title: undefined,
        // type:undefined,
        description: undefined,
        applyToList: false,
        icon: undefined,
        backgroundColor: '#34AEFF',
        applyToBanner: false,
        banner: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑小程序',
        create: '创建小程序'
      },
      qiniu: {},
      bannerSortMode: false,
      listSortMode: false
    }
  },
  created() {
    this.getListByPage()
  },
  methods: {
    getListByPage() {
      this.listLoading = true
      fetchListByPage(this.listQuery).then(response => {
        this.wxapps = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getBannerWXApps() {
      this.listLoading = true
      fetchListByType({ type: 'applyToBanner' }).then(response => {
        this.bannerWXApps = response.data
        this.listLoading = false
      })
    },
    getListWXApps() {
      this.listLoading = true
      fetchListByType({ type: 'applyToList' }).then(response => {
        this.listWXApps = response.data
        this.listLoading = false
      })
    },
    handleTabClick(tab, event) {
      if (this.activeTabName !== tab.name) {
        this.activeTabName = tab.name
        if (this.activeTabName === 'wxapp-of-banner') {
          this.getBannerWXApps()
        }
        if (this.activeTabName === 'wxapp-of-list') {
          this.getListWXApps()
        }
      }
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getListByPage()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getListByPage()
    },
    resetTemp() {
      this.tempWXApp = {
        id: undefined,
        appid: undefined,
        needPath: false,
        path: undefined,
        title: undefined,
        description: undefined,
        // type : undefined,
        applyToList: false,
        icon: undefined,
        backgroundColor: '#34AEFF',
        applyToBanner: false,
        banner: undefined
      }
    },
    handleImageUpload(obj) {
      getUploadToken({}).then((response) => {
        console.info('data: ', response.data)
        this.qiniu = {
          uploadToken: response.data.uploadToken,
          baseUrl: response.data.baseUrl
        }
        const uploader = upload(this.qiniu.uploadToken)
        this.qiniu.subscription = uploader(obj)
      })
    },
    handleBannerImageSuccess(res, file) {
      this.tempWXApp.banner = this.qiniu.baseUrl + res.key
    },
    handleIconImageSuccess(res, file) {
      this.tempWXApp.icon = this.qiniu.baseUrl + res.key
    },
    beforeImageUpload(file) {
      const allowdTypes = ['image/jpeg', 'image/png']
      const isAllowedType = allowdTypes.indexOf(file.type) !== -1
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isAllowedType) {
        this.$message.error('上传头像图片只能是 JPG / PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isAllowedType && isLt2M
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createApp() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const wxapp = {
            appid: this.tempWXApp.appid,
            title: this.tempWXApp.title,
            description: this.tempWXApp.description,
            needPath: this.tempWXApp.needPath,
            applyToList: this.tempWXApp.applyToList,
            applyToBanner: this.tempWXApp.applyToBanner
          }
          if (wxapp.needPath) {
            wxapp.path = this.tempWXApp.path
          }
          if (wxapp.applyToList) {
            wxapp.icon = this.tempWXApp.icon
            wxapp.backgroundColor = this.tempWXApp.backgroundColor
          }
          if (wxapp.applyToBanner) {
            wxapp.banner = this.tempWXApp.banner
          }
          createApp(wxapp).then((response) => {
            this.wxapps.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.tempWXApp = {
        id: row._id,
        appid: row.appid,
        needPath: row.needPath,
        path: row.path,
        title: row.title,
        description: row.description,
        applyToList: row.applyToList,
        icon: row.icon,
        backgroundColor: row.backgroundColor,
        applyToBanner: row.applyToBanner,
        banner: row.banner
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateApp() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const id = this.tempWXApp.id
          const wxapp = {
            appid: this.tempWXApp.appid,
            title: this.tempWXApp.title,
            description: this.tempWXApp.description,
            needPath: this.tempWXApp.needPath,
            applyToList: this.tempWXApp.applyToList,
            applyToBanner: this.tempWXApp.applyToBanner
          }
          if (wxapp.needPath) {
            wxapp.path = this.tempWXApp.path
          }
          if (wxapp.applyToList) {
            wxapp.icon = this.tempWXApp.icon
            wxapp.backgroundColor = this.tempWXApp.backgroundColor
          }
          if (wxapp.applyToBanner) {
            wxapp.banner = this.tempWXApp.banner
          }
          updateApp(id, wxapp).then((response) => {
            const updatedApp = response.data
            for (const v of this.wxapps) {
              if (v._id === updatedApp._id) {
                const index = this.wxapps.indexOf(v)
                this.wxapps.splice(index, 1, updatedApp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleRemove(row) {
      this.$confirm('此操作将永久删除该小程序, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeApp(row._id).then((response) => {
          const removedApp = response.data
          for (const v of this.wxapps) {
            if (v._id === removedApp._id) {
              const index = this.wxapps.indexOf(v)
              this.wxapps.splice(index, 1)
              break
            }
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleBannerAppsSort(val) {
      if (val) { // 拖拽排序模式
        if (this.bannerSortable) {
          const state = this.bannerSortable.option('disabled')
          this.bannerSortable.option('disabled', !state)
        } else {
          const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[1]
          this.bannerSortable = Sortable.create(el, {
            ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
            setData: function(dataTransfer) {
              dataTransfer.setData('Text', '')
              // to avoid Firefox bug
              // Detail see : https://github.com/RubaXa/Sortable/issues/1012
            },
            onEnd: evt => {
              const targetRow = this.bannerWXApps.splice(evt.oldIndex, 1)[0]
              this.bannerWXApps.splice(evt.newIndex, 0, targetRow)
            }
          })
        }
      } else { // 查看模式
        const state = this.bannerSortable.option('disabled')
        this.bannerSortable.option('disabled', !state)
      }
    },
    updateBannerAppsSort() {
      const bannerIndexes = this.bannerWXApps.map(v => v._id)
      updateBannerIndex({ bannerIndexes }).then(response => {
        this.bannerWXApps = response.data
        this.bannerSortMode = false
        const state = this.bannerSortable.option('disabled')
        this.bannerSortable.option('disabled', !state)
      })
    },
    handleListAppsSort(val) {
      if (val) { // 拖拽排序模式
        if (this.listSortable) {
          const state = this.listSortable.option('disabled')
          this.listSortable.option('disabled', !state)
        } else {
          const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[2]
          this.listSortable = Sortable.create(el, {
            ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
            setData: function(dataTransfer) {
              dataTransfer.setData('Text', '')
              // to avoid Firefox bug
              // Detail see : https://github.com/RubaXa/Sortable/issues/1012
            },
            onEnd: evt => {
              const targetRow = this.listWXApps.splice(evt.oldIndex, 1)[0]
              this.listWXApps.splice(evt.newIndex, 0, targetRow)
            }
          })
        }
      } else { // 查看模式
        const state = this.listSortable.option('disabled')
        this.listSortable.option('disabled', !state)
      }
    },
    updateListAppsSort() {
      const listIndexes = this.listWXApps.map(v => v._id)
      updateListIndex({ listIndexes }).then(response => {
        this.listWXApps = response.data
        this.listSortMode = false
        const state = this.listSortable.option('disabled')
        this.listSortable.option('disabled', !state)
      })
    }
  }
}
</script>
