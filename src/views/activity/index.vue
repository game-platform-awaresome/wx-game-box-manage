<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" v-waves icon="el-icon-edit">添加活动</el-button>
    </div>

    <el-table :key="tableKey" :data="list" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
      <el-table-column label="活动名称" >
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
          <el-tag v-if="scope.row.isCurrent">当前</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="活动奖品" >
        <template slot-scope="scope">
          <span>{{ scope.row.giftName }}</span>
          <el-tag>{{ scope.row.giftPrice }} 元</el-tag>
          <el-tag>{{ scope.row.giftTotalCount }} 份</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="400" label="活动时间" >
        <template slot-scope="scope">
          <span>{{ scope.row.startDate | moment('YYYY-MM-DD HH:mm:ss') }} 至 {{ scope.row.endDate | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 活动创建对话框 -->
    <el-dialog title="创建活动" :visible.sync="createDialogVisible">
      <el-form ref="activityForm" :model="tempActivity" status-icon label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
        <el-form-item 
          label="活动名称" 
          prop="title"
          :rules="[
            { type: 'string', required: true, message: '活动名称不能为空', trigger: 'change' }
          ]">
          <el-input v-model="tempActivity.title"></el-input>
        </el-form-item>
        <el-form-item 
          label="奖品名称" 
          prop="giftName"
          :rules="[
            { type: 'string', required: true, message: '奖品名称不能为空', trigger: 'change' }
          ]">
          <el-input v-model="tempActivity.giftName"></el-input>
        </el-form-item>
        <el-form-item 
          label="奖品价格" 
          prop="giftPrice"
          :rules="[
            { required: true, message: '奖品价格不能为空', trigger: 'change' },
            { type: 'number', message: '奖品价格必须为数字', trigger: 'change' }
          ]">
          <el-input v-model.number="tempActivity.giftPrice">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item 
          label="奖品总数量" 
          prop="giftTotalCount"
          :rules="[
            { required: true, message: '奖品总数量不能为空', trigger: 'change' },
            { type: 'number', message: '奖品总数量必须为数字', trigger: 'change' }
          ]">
          <el-input-number v-model.number="tempActivity.giftTotalCount" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item 
          label="活动时间" 
          prop="rangeDate"
          :rules="[
            { required: true, message: '活动时间不能为空', trigger: 'change' },
          ]">
          <el-date-picker 
            v-model="tempActivity.rangeDate" 
            type="datetimerange" 
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开启活动" required>
          <el-switch v-model="tempActivity.isActive"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createActivity">确认</el-button>
      </div>
    </el-dialog>

    <!-- 活动编辑对话框 -->
    <el-dialog title="编辑活动" :visible.sync="updateDialogVisible">
      <el-tabs :value="activeTabName" @tab-click="handleTabClick" tab-position="left">
        <el-tab-pane label="基本信息" name="baseInfo">
          <el-form ref="baseInfoForm" :model="tempActivity" status-icon label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
            <el-form-item 
              label="活动名称" 
              prop="title"
              :rules="[
                { type: 'string', required: true, message: '活动名称不能为空', trigger: 'change' }
              ]">
              <el-input v-model="tempActivity.title"></el-input>
            </el-form-item>
            <el-form-item 
              label="奖品名称" 
              prop="giftName"
              :rules="[
                { type: 'string', required: true, message: '奖品名称不能为空', trigger: 'change' }
              ]">
              <el-input v-model="tempActivity.giftName"></el-input>
            </el-form-item>
            <el-form-item 
              label="奖品价格" 
              prop="giftPrice"
              :rules="[
                { required: true, message: '奖品价格不能为空', trigger: 'change' },
                { type: 'number', message: '奖品价格必须为数字', trigger: 'change' }
              ]">
              <el-input v-model.number="tempActivity.giftPrice">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item 
              label="奖品总数量" 
              prop="giftTotalCount"
              :rules="[
                { required: true, message: '奖品总数量不能为空', trigger: 'change' },
                { type: 'number', message: '奖品总数量必须为数字', trigger: 'change' }
              ]">
              <el-input-number v-model.number="tempActivity.giftTotalCount" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item 
              label="活动时间" 
              prop="rangeDate"
              :rules="[
                { required: true, message: '活动时间不能为空', trigger: 'change' },
              ]">
              <el-date-picker 
                v-model="tempActivity.rangeDate" 
                type="datetimerange" 
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="开启活动" required>
              <el-switch v-model="tempActivity.isActive"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="updateBaseInfo()">确认修改</el-button>
              <el-button size="mini" @click="resetForm('baseInfoForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="Banner&Header图" name="bannerImage">
          <el-form ref="bannerImageForm" :model="tempActivity" status-icon label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
            <el-form-item 
              label="Banner图"
              prop="bannerUrl"
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
                <img v-if="tempActivity.bannerUrl" :src="tempActivity.bannerUrl" class="image">
                <i v-else class="el-icon-plus image-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="Header图继承" required>
              <el-switch v-model="tempActivity.isSame"></el-switch>
            </el-form-item>
            <el-form-item
              v-if="!tempActivity.isSame" 
              label="Header图"
              prop="headerUrl"
              :rules="[
                { type: 'string', required: true, message: '请上传Header图', trigger: 'blur' }
              ]">
              <el-upload
                class="image-uploader"
                action="action"
                :http-request="handleImageUpload"
                :show-file-list="false"
                :on-success="handleHeaderImageSuccess"
                :before-upload="beforeImageUpload">
                <img v-if="tempActivity.headerUrl" :src="tempActivity.headerUrl" class="image">
                <i v-else class="el-icon-plus image-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="updateBannerImage()">确认修改</el-button>
              <el-button size="mini" @click="resetForm('bannerImageForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="活动规则" name="ruleImage">
          <el-form ref="ruleImageForm" :model="tempActivity" status-icon label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
            <el-form-item 
              label="活动规则图"
              prop="ruleUrl"
              :rules="[
                { type: 'string', required: true, message: '请上传活动规则图', trigger: 'blur' }
              ]">
              <el-upload
                class="image-uploader"
                action="action"
                :http-request="handleImageUpload"
                :show-file-list="false"
                :on-success="handleRuleImageSuccess"
                :before-upload="beforeImageUpload">
                <img v-if="tempActivity.ruleUrl" :src="tempActivity.ruleUrl" class="image rule">
                <i v-else class="el-icon-plus image-uploader-icon rule"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="updateRuleImage()">确认修改</el-button>
              <el-button size="mini" @click="resetForm('ruleImageForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="分享信息" name="shareInfo">
          <el-form ref="shareInfoForm" :model="tempActivity" status-icon label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
            <el-form-item 
              label="正常分享标题" 
              prop="normalShareTitle"
              :rules="[
                { type: 'string', required: true, message: '正常分享标题不能为空', trigger: 'change' }
              ]">
              <el-input v-model="tempActivity.normalShareTitle"></el-input>
            </el-form-item>
            <el-form-item 
              label="正常分享图"
              prop="normalShareUrl"
              :rules="[
                { type: 'string', required: true, message: '请上传正常分享图', trigger: 'blur' }
              ]">
              <el-upload
                class="image-uploader"
                action="action"
                :http-request="handleImageUpload"
                :show-file-list="false"
                :on-success="handleNormalShareImageSuccess"
                :before-upload="beforeImageUpload">
                <img v-if="tempActivity.normalShareUrl" :src="tempActivity.normalShareUrl" class="image share">
                <i v-else class="el-icon-plus image-uploader-icon share"></i>
              </el-upload>
            </el-form-item>
            <el-form-item 
              label="助力分享标题" 
              prop="helpShareTitle"
              :rules="[
                { type: 'string', required: true, message: '助力分享标题不能为空', trigger: 'change' }
              ]">
              <el-input v-model="tempActivity.helpShareTitle"></el-input>
            </el-form-item>
            <el-form-item 
              label="助力分享图"
              prop="helpShareUrl"
              :rules="[
                { type: 'string', required: true, message: '请上传助力分享图', trigger: 'blur' }
              ]">
              <el-upload
                class="image-uploader"
                action="action"
                :http-request="handleImageUpload"
                :show-file-list="false"
                :on-success="handleHelpShareImageSuccess"
                :before-upload="beforeImageUpload">
                <img v-if="tempActivity.helpShareUrl" :src="tempActivity.helpShareUrl" class="image share">
                <i v-else class="el-icon-plus image-uploader-icon share"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="updateShareInfo()">确认修改</el-button>
              <el-button size="mini" @click="resetForm('shareInfoForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="砍价档次" name="bargainSteps">
          <el-form ref="bargainStepsForm" :model="tempActivity" status-icon label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
            <el-form-item
              v-for="(step, index) in tempActivity.bargainSteps"
              :label="index === 0 ? '本人砍价' : '第' + index + '次助战砍价'"
              :key="step.key"
              :prop="'bargainSteps.' + index + '.value'"
              :rules="[
                { required: true, message: '砍价档次不能为空', trigger: 'blur' },
                { type: 'number', message: '砍价档次必须为数字', trigger: 'change' }
              ]">
              <el-input v-model.number="step.value">
                <el-button v-if="index > 1" slot="append" icon="el-icon-delete" @click.prevent="removeStep(step)"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="addStep">新增档次</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="updateBargainSteps()">确认修改</el-button>
              <el-button size="mini" @click="resetForm('bargainStepsForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane v-if="!tempActivity.isCurrent" label="设置为当前活动" name="status">
          <el-button type="primary" size="mini" @click="handleUpdateCurrent()">确认设置</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<style>
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
import { fetchList, createActivity, updateBaseInfo,
  updateBannerImage, updateRuleImage, updateShareInfo,
  updateCurrent, updateBargainSteps } from '@/api/activity'
import { getUploadToken } from '@/api/qiniu'
import waves from '@/directive/waves' // 水波纹指令
import { upload } from './upload'

export default {
  name: 'activity',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      tempActivity: {
        id: undefined,
        title: undefined,
        giftName: undefined,
        giftPrice: undefined,
        giftTotalCount: undefined,
        bannerUrl: undefined,
        headerUrl: undefined,
        bargainSteps: undefined,
        rangeDate: [this.$moment().startOf('day').toDate(), this.$moment().endOf('day').toDate()],
        isCurrent: false,
        isActive: true
      },
      createDialogVisible: false,
      imageDialogVisible: false,
      qiniu: {},
      stepDialogVisible: false,
      updateDialogVisible: false,
      activeTabName: 'baseInfo'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    resetTempActivity() {
      this.tempActivity = {
        id: undefined,
        title: undefined,
        giftName: undefined,
        giftPrice: undefined,
        giftTotalCount: undefined,
        bannerUrl: undefined,
        headerUrl: undefined,
        bargainSteps: undefined,
        rangeDate: [this.$moment().startOf('day').toDate(), this.$moment().endOf('day').toDate()],
        isCurrent: false,
        isActive: true
      }
    },
    handleCreate() {
      this.resetTempActivity()
      this.createDialogVisible = true
      this.$nextTick(() => {
        this.$refs['activityForm'].clearValidate()
      })
    },
    createActivity() {
      this.$refs['activityForm'].validate((valid) => {
        if (valid) {
          const activity = {
            title: this.tempActivity.title,
            giftName: this.tempActivity.giftName,
            giftPrice: this.tempActivity.giftPrice,
            giftTotalCount: this.tempActivity.giftTotalCount,
            startDate: this.tempActivity.rangeDate[0],
            endDate: this.tempActivity.rangeDate[1],
            isActive: this.tempActivity.isActive
          }
          createActivity(activity).then((response) => {
            this.list.unshift(response.data)
            this.createDialogVisible = false
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
      this.tempActivity = {
        id: row._id,
        title: row.title,
        giftName: row.giftName,
        giftPrice: row.giftPrice,
        giftTotalCount: row.giftTotalCount,
        rangeDate: [this.$moment(row.startDate).toDate(), this.$moment(row.endDate).toDate()],
        isActive: row.isActive,
        bannerUrl: row.bannerUrl,
        headerUrl: row.headerUrl,
        isSame: row.bannerUrl === row.headerUrl,
        ruleUrl: row.ruleUrl,
        normalShareTitle: row.normalShareTitle,
        normalShareUrl: row.normalShareUrl,
        helpShareTitle: row.helpShareTitle,
        helpShareUrl: row.helpShareUrl,
        bargainSteps: [],
        isCurrent: row.isCurrent
      }
      if (row.bargainSteps.length !== 0) {
        this.tempActivity.bargainSteps = row.bargainSteps.map((step, index) => {
          return {
            value: step,
            key: 'step-' + index
          }
        })
      } else {
        var halfPrice = Math.floor(row.giftPrice / 2)
        this.tempActivity.bargainSteps.push({
          value: halfPrice,
          key: 'step-0'
        })
        this.tempActivity.bargainSteps.push({
          value: row.giftPrice - halfPrice,
          key: 'step-1'
        })
      }
      this.updateDialogVisible = true
      this.activeTabName = 'baseInfo'
      this.$nextTick(() => {
        this.$refs['baseInfoForm'].clearValidate()
      })
    },
    handleTabClick(tab, event) {
      if (this.activeTabName !== tab.name) {
        this.activeTabName = tab.name
        if (this.activeTabName !== 'status') {
          this.$refs[this.activeTabName + 'Form'].clearValidate()
        }
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    updateBaseInfo() {
      this.$refs['baseInfoForm'].validate((valid) => {
        if (valid) {
          const id = this.tempActivity.id
          const tempData = {
            title: this.tempActivity.title,
            giftName: this.tempActivity.giftName,
            giftPrice: this.tempActivity.giftPrice,
            giftTotalCount: this.tempActivity.giftTotalCount,
            startDate: this.tempActivity.rangeDate[0],
            endDate: this.tempActivity.rangeDate[1],
            isActive: this.tempActivity.isActive
          }
          updateBaseInfo(id, tempData).then((response) => {
            const updatedActivity = response.data
            for (const v of this.list) {
              if (v._id === updatedActivity._id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, updatedActivity)
                break
              }
            }
            this.updateDialogVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdateCurrent() {
      updateCurrent({
        currentActivity: this.tempActivity.id
      }).then((response) => {
        const currentActivity = response.data.currentActivity
        for (const v of this.list) {
          if (v._id === currentActivity) {
            v.isCurrent = true
          } else {
            v.isCurrent = false
          }
        }
        this.updateDialogVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
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
      this.tempActivity.bannerUrl = this.qiniu.baseUrl + res.key
    },
    handleHeaderImageSuccess(res, file) {
      this.tempActivity.headerUrl = this.qiniu.baseUrl + res.key
    },
    handleRuleImageSuccess(res, file) {
      this.tempActivity.ruleUrl = this.qiniu.baseUrl + res.key
    },
    handleNormalShareImageSuccess(res, file) {
      this.tempActivity.normalShareUrl = this.qiniu.baseUrl + res.key
    },
    handleHelpShareImageSuccess(res, file) {
      this.tempActivity.helpShareUrl = this.qiniu.baseUrl + res.key
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
    updateBannerImage() {
      this.$refs['bannerImageForm'].validate((valid) => {
        if (valid) {
          const id = this.tempActivity.id
          const tempData = {
            bannerUrl: this.tempActivity.bannerUrl
          }
          if (this.tempActivity.isSame) {
            tempData.headerUrl = this.tempActivity.bannerUrl
          } else {
            tempData.headerUrl = this.tempActivity.headerUrl
          }
          updateBannerImage(id, tempData).then((response) => {
            const updatedActivity = response.data
            for (const v of this.list) {
              if (v._id === updatedActivity._id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, updatedActivity)
                break
              }
            }
            this.updateDialogVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateRuleImage() {
      this.$refs['ruleImageForm'].validate((valid) => {
        if (valid) {
          const id = this.tempActivity.id
          const tempData = {
            ruleUrl: this.tempActivity.ruleUrl
          }
          updateRuleImage(id, tempData).then((response) => {
            const updatedActivity = response.data
            for (const v of this.list) {
              if (v._id === updatedActivity._id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, updatedActivity)
                break
              }
            }
            this.updateDialogVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateShareInfo() {
      this.$refs['shareInfoForm'].validate((valid) => {
        if (valid) {
          const id = this.tempActivity.id
          const tempData = {
            normalShareTitle: this.tempActivity.normalShareTitle,
            normalShareUrl: this.tempActivity.normalShareUrl,
            helpShareTitle: this.tempActivity.helpShareTitle,
            helpShareUrl: this.tempActivity.helpShareUrl
          }
          updateShareInfo(id, tempData).then((response) => {
            const updatedActivity = response.data
            for (const v of this.list) {
              if (v._id === updatedActivity._id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, updatedActivity)
                break
              }
            }
            this.updateDialogVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    removeStep(step) {
      var index = this.tempActivity.bargainSteps.indexOf(step)
      if (index !== -1) {
        this.tempActivity.bargainSteps.splice(index, 1)
      }
    },
    addStep() {
      let bargainTotalPrice = 0
      this.tempActivity.bargainSteps.forEach(step => {
        bargainTotalPrice += step.value
      })
      if (bargainTotalPrice < this.tempActivity.giftPrice) {
        this.tempActivity.bargainSteps.push({
          value: 1,
          key: 'step-' + this.tempActivity.bargainSteps.length
        })
      } else {
        this.$message.error('当前档次价格总和已大于或等于奖品价格')
      }
    },
    updateBargainSteps() {
      this.$refs['bargainStepsForm'].validate((valid) => {
        if (valid) {
          const id = this.tempActivity.id
          let bargainTotalPrice = 0
          const bargainSteps = this.tempActivity.bargainSteps.map(step => {
            bargainTotalPrice += step.value
            return step.value
          })
          if (bargainTotalPrice > this.tempActivity.giftPrice) {
            this.$message.error('砍价档次总和不能大于奖品价格')
          } else {
            const tempData = {
              bargainSteps: bargainSteps,
              giftFloorPrice: this.tempActivity.giftPrice - bargainTotalPrice
            }
            updateBargainSteps(id, tempData).then((response) => {
              const updatedActivity = response.data
              for (const v of this.list) {
                if (v._id === updatedActivity._id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, updatedActivity)
                  break
                }
              }
              this.updateDialogVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        }
      })
    }
  }
}
</script>
