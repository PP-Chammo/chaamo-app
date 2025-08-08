import { memo } from 'react';

import { TouchableOpacity, View } from 'react-native';

import { Row, Icon, Label } from '@/components/atoms';
import { getColor } from '@/utils/getColor';

interface SettingsListItemProps {
  iconName: string;
  iconVariant?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
}

const SettingItem: React.FC<SettingsListItemProps> = memo(
  function SettingsListItem({
    iconName,
    iconVariant = 'MaterialCommunityIcons',
    iconColor = getColor('gray-500'),
    title,
    subtitle,
    value,
    onPress,
  }: SettingsListItemProps) {
    return (
      <TouchableOpacity
        testID="setting-item"
        className={classes.itemTouchable}
        onPress={onPress}
      >
        <Row between className={classes.itemRow}>
          <Row className={classes.gap3}>
            <Icon
              name={iconName}
              size={24}
              variant={iconVariant}
              color={iconColor}
            />
            <View>
              <Label className={classes.title}>{title}</Label>
              {subtitle && (
                <Label className={classes.itemSubtitle}>{subtitle}</Label>
              )}
            </View>
          </Row>
          <Row className={classes.gap2}>
            {value && <Label className={classes.valueText}>{value}</Label>}
            {onPress && (
              <Icon
                testID="chevron-icon"
                name="chevron-right"
                size={24}
                variant="MaterialCommunityIcons"
                color={getColor('gray-400')}
              />
            )}
          </Row>
        </Row>
      </TouchableOpacity>
    );
  },
);

export default SettingItem;

const classes = {
  itemTouchable: 'px-4 py-2',
  itemRow: 'py-2',
  itemSubtitle: 'text-xs !text-gray-500 font-light',
  valueText: 'text-slate-500',
  title: 'text-slate-800',
  gap3: 'gap-3',
  gap2: 'gap-2',
};
