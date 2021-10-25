import { computed, defineComponent, PropType, ref, VNode } from 'vue';
import { Direction, Size } from '../_utils/constant';
import { Positions, TabList, Types } from './interface';
import {
  foreachComponent,
  getBooleanProp,
  getChildrenComponents,
  isSlotsChildren,
} from '../_utils/vue-utils';
import { getPrefixCls } from '../_utils/global-config';
import TabsNav from './tabs-nav';
import usePickSlots from '../_hooks/use-pick-slots';

export default defineComponent({
  name: 'Tabs',
  props: {
    /**
     * @zh 当前选中的标签的 `key`
     * @en The `key` of the currently selected label
     * @vModel
     */
    activeKey: {
      type: String,
      default: undefined,
    },
    /**
     * @zh 默认选中的标签的`key`（非受控状态，为空时选中第一个标签页）
     * @en The `key` of the tab selected by default (uncontrolled state, select the first tab page when it is empty)
     */
    defaultActiveKey: {
      type: String,
      default: '',
    },
    /**
     * @zh 选项卡的位置
     * @en Position of the tab
     * @values 'left', 'right', 'top', 'bottom'
     */
    position: {
      type: String as PropType<Positions>,
      default: 'top',
    },
    /**
     * @zh 选项卡的大小
     * @en The size of the tab
     * @values 'mini', 'small', 'medium', 'large'
     */
    size: {
      type: String as PropType<Size>,
      default: 'medium',
    },
    /**
     * @zh 选项卡的类型
     * @en The type of tab
     * @values 'line', 'card', 'card-gutter', 'text', 'rounded', 'capsule'
     */
    type: {
      type: String as PropType<Types>,
      default: 'line',
    },
    /**
     * @zh 选项卡的方向
     * @en The direction of tab
     * @values 'horizontal', 'vertical'
     */
    direction: {
      type: String as PropType<Direction>,
      default: 'horizontal',
    },
    /**
     * @zh 是否开启可编辑模式
     * @en Whether to enable editable mode
     */
    editable: {
      type: Boolean,
      default: false,
    },
    /**
     * @zh 是否显示增加按钮（仅在可编辑模式可用）
     * @en Whether to display the add button (only available in editable mode)
     */
    showAddButton: {
      type: Boolean,
      default: false,
    },
    /**
     * @zh 是否在不显示标签时销毁内容
     * @en Whether to destroy the content when the label is not displayed
     */
    destroyOnHide: {
      type: Boolean,
      default: false,
    },
    /**
     * @zh 是否在首次展示标签时挂载内容
     * @en Whether to mount the content when the label is first displayed
     */
    lazyLoad: {
      type: Boolean,
      default: false,
    },
    /**
     * @zh 高度撑满容器，只在水平模式下生效。
     * @en The height of the container is fully supported, and it only takes effect in horizontal mode.
     */
    justify: {
      type: Boolean,
      default: false,
    },
    /**
     * @zh 是否开启选项内容过渡动画
     * @en Whether to enable option content transition animation
     */
    animation: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'update:activeKey',
    /**
     * @zh 当前标签值改变时触发
     * @en Triggered when the current tag value changes
     * @property {string} key
     */
    'change',
    /**
     * @zh 用户点击标签时触发
     * @en Triggered when the user clicks on the tab
     * @property {string} key
     */
    'tabClick',
    /**
     * @zh 用户点击增加按钮时触发
     * @en Triggered when the user clicks the add button
     */
    'add',
    /**
     * @zh 用户点击删除按钮时触发
     * @en Triggered when the user clicks the delete button
     * @property {string} key
     */
    'delete',
  ],
  /**
   * @zh 选项卡额外内容
   * @en Additional tab content
   * @slot extra
   */
  setup(props, { emit, slots }) {
    const prefixCls = getPrefixCls('tabs');
    const mergedPosition = computed(() =>
      props.direction === 'vertical' ? 'left' : props.position
    );
    const mergedDirection = computed(() =>
      ['left', 'right'].includes(mergedPosition.value)
        ? 'vertical'
        : 'horizontal'
    );

    const defaultSlot = usePickSlots(slots, 'default');

    // Get tab from TabPane
    const tabs = computed(() => {
      const tabs: TabList = [];
      const children = defaultSlot.value?.() ?? [];
      foreachComponent(children, 'TabPane', (node) => {
        tabs.push({
          title:
            isSlotsChildren(node, node.children) && node.children.title
              ? node.children.title
              : () => node.props?.title,
          key: String(node.key),
          disabled: getBooleanProp(node.props?.disabled),
          closable: getBooleanProp(node.props?.closable),
        });
      });

      return tabs;
    });

    const _activeTab = ref(props.defaultActiveKey || tabs.value[0]?.key);
    const computedActiveTab = computed(
      () => props.activeKey ?? _activeTab.value
    );

    const loadedTabs = new Set<string>([computedActiveTab.value]);

    const handleClick = (key: string, e: Event) => {
      if (key !== computedActiveTab.value) {
        _activeTab.value = key;
        loadedTabs.add(key);
        emit('update:activeKey', key);
        emit('change', key);
      }
      emit('tabClick', key, e);
    };

    const children = computed(() =>
      getChildrenComponents(slots.default?.() ?? [], 'TabPane')
    );

    const activeIndex = computed(() => {
      for (let i = 0; i < tabs.value.length; i++) {
        if (tabs.value[i].key === computedActiveTab.value) {
          return i;
        }
      }
      return 0;
    });

    const getIsRender = (isActive: boolean, key: string) => {
      if (isActive) {
        return true;
      }
      if (props.lazyLoad) {
        return loadedTabs.has(key);
      }
      return !props.destroyOnHide;
    };

    const renderContent = () => {
      const list: VNode[] = [];

      foreachComponent(children.value, 'TabPane', (vn) => {
        const key = String(vn.key);
        const isActive = key === computedActiveTab.value;

        list.push(
          <div
            key={key}
            class={[
              `${prefixCls}-content-item`,
              {
                [`${prefixCls}-content-item-active`]: isActive,
              },
            ]}
          >
            {getIsRender(isActive, key) && vn}
          </div>
        );
      });
      return (
        <div class={`${prefixCls}-content`}>
          <div
            class={[
              `${prefixCls}-content-list`,
              {
                [`${prefixCls}-content-animation`]: props.animation,
              },
            ]}
            style={{ marginLeft: `-${activeIndex.value * 100}%` }}
          >
            {list}
          </div>
        </div>
      );
    };

    const cls = computed(() => [
      prefixCls,
      `${prefixCls}-${mergedDirection.value}`,
      `${prefixCls}-${mergedPosition.value}`,
      `${prefixCls}-type-${props.type}`,
      `${prefixCls}-size-${props.size}`,
      {
        [`${prefixCls}-justify`]: props.justify,
      },
    ]);

    return () => (
      <div class={cls.value}>
        {mergedPosition.value === 'bottom' && renderContent()}
        <TabsNav
          v-slots={{ extra: slots.extra }}
          tabs={tabs.value}
          activeTab={computedActiveTab.value}
          direction={mergedDirection.value}
          position={mergedPosition.value}
          editable={props.editable}
          animation={props.animation}
          size={props.size}
          type={props.type}
          onClick={handleClick}
          onAdd={() => emit('add')}
          onDelete={(key: string) => emit('delete', key)}
        />
        {mergedPosition.value !== 'bottom' && renderContent()}
      </div>
    );
  },
});