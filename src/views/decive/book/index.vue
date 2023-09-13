<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备id" prop="deviceId">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入设备id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备编码" prop="deviceCode">
        <el-input
          v-model="queryParams.deviceCode"
          placeholder="请输入设备编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备类别" prop="categoryId">
        <el-input
          v-model="queryParams.categoryId"
          placeholder="请输入设备类别"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否是特种设备(Y 是、N 否)" prop="isSpecial">
        <el-input
          v-model="queryParams.isSpecial"
          placeholder="请输入是否是特种设备(Y 是、N 否)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="功能位置" prop="LOCATION">
        <el-input
          v-model="queryParams.LOCATION"
          placeholder="请输入功能位置"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规格型号" prop="sModel">
        <el-input
          v-model="queryParams.sModel"
          placeholder="请输入规格型号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备属性(1 设备、2 部件)" prop="deviceAtt">
        <el-input
          v-model="queryParams.deviceAtt"
          placeholder="请输入设备属性(1 设备、2 部件)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前使用组织" prop="currDeptId">
        <el-input
          v-model="queryParams.currDeptId"
          placeholder="请输入当前使用组织"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属组织" prop="affDeptId">
        <el-input
          v-model="queryParams.affDeptId"
          placeholder="请输入所属组织"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上级设备(0 父级)" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入上级设备(0 父级)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="重要等级(A、B、C)" prop="LEVEL">
        <el-input
          v-model="queryParams.LEVEL"
          placeholder="请输入重要等级(A、B、C)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="使用部门" prop="useDeptId">
        <el-input
          v-model="queryParams.useDeptId"
          placeholder="请输入使用部门"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次编号" prop="batchNo">
        <el-input
          v-model="queryParams.batchNo"
          placeholder="请输入批次编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="煤安标志证号" prop="logoNo">
        <el-input
          v-model="queryParams.logoNo"
          placeholder="请输入煤安标志证号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="存放位置" prop="POSITION">
        <el-input
          v-model="queryParams.POSITION"
          placeholder="请输入存放位置"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="防爆合格证" prop="CERTIFICATE">
        <el-input
          v-model="queryParams.CERTIFICATE"
          placeholder="请输入防爆合格证"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计量单位(台、个、座、件)" prop="UNIT">
        <el-input
          v-model="queryParams.UNIT"
          placeholder="请输入计量单位(台、个、座、件)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="重量(千克)" prop="WEIGHT">
        <el-input
          v-model="queryParams.WEIGHT"
          placeholder="请输入重量(千克)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="大小/尺寸mm" prop="SIZE">
        <el-input
          v-model="queryParams.SIZE"
          placeholder="请输入大小/尺寸mm"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否融资设备(Y 是、N 否)" prop="isFinan">
        <el-input
          v-model="queryParams.isFinan"
          placeholder="请输入是否融资设备(Y 是、N 否)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="融资设备到期日" prop="finanTime">
        <el-date-picker clearable
          v-model="queryParams.finanTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择融资设备到期日">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="折旧年限" prop="depLife">
        <el-input
          v-model="queryParams.depLife"
          placeholder="请输入折旧年限"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否租赁设备(Y 是、N 否)" prop="isLease">
        <el-input
          v-model="queryParams.isLease"
          placeholder="请输入是否租赁设备(Y 是、N 否)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="租赁设备到期日" prop="leaseTime">
        <el-date-picker clearable
          v-model="queryParams.leaseTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择租赁设备到期日">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="提交时间" prop="sumbitTime">
        <el-date-picker clearable
          v-model="queryParams.sumbitTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择提交时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="完成时间" prop="finishTime">
        <el-date-picker clearable
          v-model="queryParams.finishTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择完成时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="消耗时间" prop="takeTime">
        <el-input
          v-model="queryParams.takeTime"
          placeholder="请输入消耗时间"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备来源(C 复制、N 新增)" prop="SOURCE">
        <el-input
          v-model="queryParams.SOURCE"
          placeholder="请输入设备来源(C 复制、N 新增)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备二维码" prop="qrCode">
        <el-input
          v-model="queryParams.qrCode"
          placeholder="请输入设备二维码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="REMARK">
        <el-input
          v-model="queryParams.REMARK"
          placeholder="请输入备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建者" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入创建者"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新者" prop="updateBy">
        <el-input
          v-model="queryParams.updateBy"
          placeholder="请输入更新者"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime">
        <el-date-picker clearable
          v-model="queryParams.updateTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择更新时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['equipment:BASE:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['equipment:BASE:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['equipment:BASE:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['equipment:BASE:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="BASEList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备id" align="center" prop="deviceId" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="设备编码" align="center" prop="deviceCode" />
      <el-table-column label="运行状态(RUN 运行中、STOP 终止)" align="center" prop="runStatus" />
      <el-table-column label="设备状态(ZY 在用、ZY 在修、DX 待修、BY 备用、TTZY 淘汰在用、DFZY 待废再用、DBF 待报废、
ZC 租出、JYSB 救援设备、CQCB 长期储备、XZ 闲置)" align="center" prop="deviceStatus" />
      <el-table-column label="设备类别" align="center" prop="categoryId" />
      <el-table-column label="是否是特种设备(Y 是、N 否)" align="center" prop="isSpecial" />
      <el-table-column label="功能位置" align="center" prop="LOCATION" />
      <el-table-column label="规格型号" align="center" prop="sModel" />
      <el-table-column label="设备属性(1 设备、2 部件)" align="center" prop="deviceAtt" />
      <el-table-column label="当前使用组织" align="center" prop="currDeptId" />
      <el-table-column label="所属组织" align="center" prop="affDeptId" />
      <el-table-column label="上级设备(0 父级)" align="center" prop="parentId" />
      <el-table-column label="重要等级(A、B、C)" align="center" prop="LEVEL" />
      <el-table-column label="使用部门" align="center" prop="useDeptId" />
      <el-table-column label="批次编号" align="center" prop="batchNo" />
      <el-table-column label="煤安标志证号" align="center" prop="logoNo" />
      <el-table-column label="存放位置" align="center" prop="POSITION" />
      <el-table-column label="防爆合格证" align="center" prop="CERTIFICATE" />
      <el-table-column label="计量单位(台、个、座、件)" align="center" prop="UNIT" />
      <el-table-column label="重量(千克)" align="center" prop="WEIGHT" />
      <el-table-column label="大小/尺寸mm" align="center" prop="SIZE" />
      <el-table-column label="是否融资设备(Y 是、N 否)" align="center" prop="isFinan" />
      <el-table-column label="融资设备到期日" align="center" prop="finanTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.finanTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折旧年限" align="center" prop="depLife" />
      <el-table-column label="是否租赁设备(Y 是、N 否)" align="center" prop="isLease" />
      <el-table-column label="租赁设备到期日" align="center" prop="leaseTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.leaseTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态(1 待提交、2 审批中、3 审批通过、 4 审批驳回 )" align="center" prop="apvStatus" />
      <el-table-column label="提交时间" align="center" prop="sumbitTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.sumbitTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成时间" align="center" prop="finishTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.finishTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消耗时间" align="center" prop="takeTime" />
      <el-table-column label="设备来源(C 复制、N 新增)" align="center" prop="SOURCE" />
      <el-table-column label="设备二维码" align="center" prop="qrCode" />
      <el-table-column label="备注" align="center" prop="REMARK" />
      <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新者" align="center" prop="updateBy" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipment:BASE:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:BASE:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备平台_设备档案_基础信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备id" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备id" />
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备编码" prop="deviceCode">
          <el-input v-model="form.deviceCode" placeholder="请输入设备编码" />
        </el-form-item>
        <el-form-item label="设备类别" prop="categoryId">
          <el-input v-model="form.categoryId" placeholder="请输入设备类别" />
        </el-form-item>
        <el-form-item label="是否是特种设备(Y 是、N 否)" prop="isSpecial">
          <el-input v-model="form.isSpecial" placeholder="请输入是否是特种设备(Y 是、N 否)" />
        </el-form-item>
        <el-form-item label="功能位置" prop="LOCATION">
          <el-input v-model="form.LOCATION" placeholder="请输入功能位置" />
        </el-form-item>
        <el-form-item label="规格型号" prop="sModel">
          <el-input v-model="form.sModel" placeholder="请输入规格型号" />
        </el-form-item>
        <el-form-item label="设备属性(1 设备、2 部件)" prop="deviceAtt">
          <el-input v-model="form.deviceAtt" placeholder="请输入设备属性(1 设备、2 部件)" />
        </el-form-item>
        <el-form-item label="当前使用组织" prop="currDeptId">
          <el-input v-model="form.currDeptId" placeholder="请输入当前使用组织" />
        </el-form-item>
        <el-form-item label="所属组织" prop="affDeptId">
          <el-input v-model="form.affDeptId" placeholder="请输入所属组织" />
        </el-form-item>
        <el-form-item label="上级设备(0 父级)" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入上级设备(0 父级)" />
        </el-form-item>
        <el-form-item label="重要等级(A、B、C)" prop="LEVEL">
          <el-input v-model="form.LEVEL" placeholder="请输入重要等级(A、B、C)" />
        </el-form-item>
        <el-form-item label="使用部门" prop="useDeptId">
          <el-input v-model="form.useDeptId" placeholder="请输入使用部门" />
        </el-form-item>
        <el-form-item label="批次编号" prop="batchNo">
          <el-input v-model="form.batchNo" placeholder="请输入批次编号" />
        </el-form-item>
        <el-form-item label="煤安标志证号" prop="logoNo">
          <el-input v-model="form.logoNo" placeholder="请输入煤安标志证号" />
        </el-form-item>
        <el-form-item label="存放位置" prop="POSITION">
          <el-input v-model="form.POSITION" placeholder="请输入存放位置" />
        </el-form-item>
        <el-form-item label="防爆合格证" prop="CERTIFICATE">
          <el-input v-model="form.CERTIFICATE" placeholder="请输入防爆合格证" />
        </el-form-item>
        <el-form-item label="计量单位(台、个、座、件)" prop="UNIT">
          <el-input v-model="form.UNIT" placeholder="请输入计量单位(台、个、座、件)" />
        </el-form-item>
        <el-form-item label="重量(千克)" prop="WEIGHT">
          <el-input v-model="form.WEIGHT" placeholder="请输入重量(千克)" />
        </el-form-item>
        <el-form-item label="大小/尺寸mm" prop="SIZE">
          <el-input v-model="form.SIZE" placeholder="请输入大小/尺寸mm" />
        </el-form-item>
        <el-form-item label="是否融资设备(Y 是、N 否)" prop="isFinan">
          <el-input v-model="form.isFinan" placeholder="请输入是否融资设备(Y 是、N 否)" />
        </el-form-item>
        <el-form-item label="融资设备到期日" prop="finanTime">
          <el-date-picker clearable
            v-model="form.finanTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择融资设备到期日">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="折旧年限" prop="depLife">
          <el-input v-model="form.depLife" placeholder="请输入折旧年限" />
        </el-form-item>
        <el-form-item label="是否租赁设备(Y 是、N 否)" prop="isLease">
          <el-input v-model="form.isLease" placeholder="请输入是否租赁设备(Y 是、N 否)" />
        </el-form-item>
        <el-form-item label="租赁设备到期日" prop="leaseTime">
          <el-date-picker clearable
            v-model="form.leaseTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择租赁设备到期日">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="提交时间" prop="sumbitTime">
          <el-date-picker clearable
            v-model="form.sumbitTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择提交时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="完成时间" prop="finishTime">
          <el-date-picker clearable
            v-model="form.finishTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="消耗时间" prop="takeTime">
          <el-input v-model="form.takeTime" placeholder="请输入消耗时间" />
        </el-form-item>
        <el-form-item label="设备来源(C 复制、N 新增)" prop="SOURCE">
          <el-input v-model="form.SOURCE" placeholder="请输入设备来源(C 复制、N 新增)" />
        </el-form-item>
        <el-form-item label="设备二维码" prop="qrCode">
          <el-input v-model="form.qrCode" placeholder="请输入设备二维码" />
        </el-form-item>
        <el-form-item label="备注" prop="REMARK">
          <el-input v-model="form.REMARK" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBASE, getBASE, delBASE, addBASE, updateBASE } from "@/api/equipment/BASE";

export default {
  name: "BASE",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 设备平台_设备档案_基础信息表格数据
      BASEList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      columns: [
        { label:"设备id", prop:"deviceId", },
        { label:"设备名称", prop:"deviceName", },
        { label:"设备编码", prop:"deviceCode", },
        { label:"设备类别", prop:"categoryId", },
        { label:"是否是特种设备(Y 是、N 否)", prop:"isSpecial", },
        { label:"功能位置", prop:"LOCATION", },
        { label:"规格型号", prop:"sModel", },
        { label:"设备属性(1 设备、2 部件)", prop:"deviceAtt", },
        { label:"当前使用组织", prop:"currDeptId", },
        { label:"所属组织", prop:"affDeptId", },
        { label:"上级设备(0 父级)", prop:"parentId", },
        { label:"重要等级(A、B、C)", prop:"LEVEL", },
        { label:"使用部门", prop:"useDeptId", },
        { label:"批次编号", prop:"batchNo", },
        { label:"煤安标志证号", prop:"logoNo", },
        { label:"存放位置", prop:"POSITION", },
        { label:"防爆合格证", prop:"CERTIFICATE", },
        { label:"计量单位(台、个、座、件)", prop:"UNIT", },
        { label:"重量(千克)", prop:"WEIGHT", },
        { label:"大小/尺寸mm", prop:"SIZE", },
        { label:"是否融资设备(Y 是、N 否)", prop:"isFinan", },
        { label:"融资设备到期日", prop:"finanTime", },
        { label:"折旧年限", prop:"depLife", },
        { label:"是否租赁设备(Y 是、N 否)", prop:"isLease", },
        { label:"租赁设备到期日", prop:"leaseTime", },
        { label:"提交时间", prop:"sumbitTime", },
        { label:"完成时间", prop:"finishTime", },
        { label:"消耗时间", prop:"takeTime", },
        { label:"设备来源(C 复制、N 新增)", prop:"SOURCE", },
        { label:"设备二维码", prop:"qrCode", },
        { label:"备注", prop:"REMARK", },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceId: null,
        deviceName: null,
        deviceCode: null,
        runStatus: null,
        deviceStatus: null,
        categoryId: null,
        isSpecial: null,
        LOCATION: null,
        sModel: null,
        deviceAtt: null,
        currDeptId: null,
        affDeptId: null,
        parentId: null,
        LEVEL: null,
        useDeptId: null,
        batchNo: null,
        logoNo: null,
        POSITION: null,
        CERTIFICATE: null,
        UNIT: null,
        WEIGHT: null,
        SIZE: null,
        isFinan: null,
        finanTime: null,
        depLife: null,
        isLease: null,
        leaseTime: null,
        apvStatus: null,
        sumbitTime: null,
        finishTime: null,
        takeTime: null,
        SOURCE: null,
        qrCode: null,
        REMARK: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deviceId: [
          { required: true, message: "设备id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询设备平台_设备档案_基础信息列表 */
    getList(queryParams) {
      this.loading = true;
      listBASE(queryParams).then(response => {
        this.BASEList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        deviceId: null,
        deviceName: null,
        deviceCode: null,
        runStatus: null,
        deviceStatus: null,
        categoryId: null,
        isSpecial: null,
        LOCATION: null,
        sModel: null,
        deviceAtt: null,
        currDeptId: null,
        affDeptId: null,
        parentId: null,
        LEVEL: null,
        useDeptId: null,
        batchNo: null,
        logoNo: null,
        POSITION: null,
        CERTIFICATE: null,
        UNIT: null,
        WEIGHT: null,
        SIZE: null,
        isFinan: null,
        finanTime: null,
        depLife: null,
        isLease: null,
        leaseTime: null,
        apvStatus: null,
        sumbitTime: null,
        finishTime: null,
        takeTime: null,
        SOURCE: null,
        qrCode: null,
        REMARK: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.deviceId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备平台_设备档案_基础信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const deviceId = row.deviceId || this.ids
      getBASE(deviceId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备平台_设备档案_基础信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deviceId != null) {
            updateBASE(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBASE(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const deviceIds = row.deviceId || this.ids;
      this.$modal.confirm('是否确认删除设备平台_设备档案_基础信息编号为"' + deviceIds + '"的数据项？').then(function() {
        return delBASE(deviceIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('equipment/BASE/export', {
        ...this.queryParams
      }, `BASE_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
