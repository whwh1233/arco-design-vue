import { computed, defineComponent, inject, PropType } from 'vue';
import { TableData, TableOperationColumn } from './interface';
import { getPrefixCls } from '../_utils/global-config';
import { getOperationFixedCls, getOperationStyle } from './utils';
import Checkbox from '../checkbox';
import Radio from '../radio';
import IconPlus from '../icon/icon-plus';
import IconMinus from '../icon/icon-minus';
import { TableContext, tableInjectionKey } from './context';

export default defineComponent({
  name: 'OperationTd',
  components: {
    Checkbox,
    Radio,
    IconPlus,
    IconMinus,
  },
  props: {
    record: {
      type: Object as PropType<TableData>,
      required: true,
    },
    operationColumn: {
      type: Object as PropType<TableOperationColumn>,
      required: true,
    },
    operations: {
      type: Array as PropType<TableOperationColumn[]>,
      required: true,
    },
    isRadio: {
      type: Boolean,
    },
    hasExpand: {
      type: Boolean,
    },
    selectedRowKeys: {
      type: Array,
      required: true,
    },
    expandedRowKeys: {
      type: Array,
      required: true,
    },
  },
  emits: ['select', 'expand'],
  setup(props, { emit }) {
    const prefixCls = getPrefixCls('table');
    const tableCtx = inject(tableInjectionKey, undefined);

    const style = computed(() =>
      getOperationStyle(props.operationColumn, props.operations)
    );

    const cls = computed(() => [
      `${prefixCls}-td`,
      `${prefixCls}-operation`,
      {
        [`${prefixCls}-checkbox`]:
          props.operationColumn.name === 'selection' && !props.isRadio,
        [`${prefixCls}-radio`]:
          props.operationColumn.name === 'selection' && props.isRadio,
        [`${prefixCls}-expand`]: props.operationColumn.name === 'expand',
      },
      ...getOperationFixedCls(prefixCls, props.operationColumn),
    ]);

    const renderSelection = () => {
      const rowKey = props.record.key;

      if (props.isRadio) {
        return (
          <Radio
            modelValue={props.selectedRowKeys[0] ?? ''}
            onChange={(value: string) => emit('select', [value])}
            disabled={Boolean(props.record.disabled)}
            value={rowKey}
          />
        );
      }

      return (
        <Checkbox
          modelValue={props.selectedRowKeys}
          onChange={(values: string[]) => emit('select', values)}
          disabled={Boolean(props.record.disabled)}
          value={rowKey}
        />
      );
    };

    const renderExpand = () => {
      if (!props.record.expand) {
        return null;
      }

      const rowKey = props.record.key;
      const expanded = props.expandedRowKeys.includes(rowKey);

      return (
        <button
          class={`${prefixCls}-expand-btn`}
          onClick={() => emit('expand', rowKey)}
        >
          {tableCtx?.expandIcon?.({ expanded, record: props.record }) ??
          expanded ? (
            <IconMinus />
          ) : (
            <IconPlus />
          )}
        </button>
      );
    };

    const renderContent = () => {
      if (props.operationColumn.name === 'selection') {
        return renderSelection();
      }
      if (props.operationColumn.name === 'expand') {
        if (props.hasExpand) {
          return renderExpand();
        }
        return null;
      }
      if (props.operationColumn.bodyNode) {
        return props.operationColumn.bodyNode(props.record, {
          class: cls.value,
          style: style.value,
        });
      }
      return null;
    };

    return () => (
      <td class={cls.value} style={style.value}>
        <span class={`${prefixCls}-cell`}>{renderContent()}</span>
      </td>
    );
  },
});