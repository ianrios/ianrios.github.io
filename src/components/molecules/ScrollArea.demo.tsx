import { Text } from '../atoms/Text';
import { ScrollArea } from './ScrollArea';

export function ScrollAreaDemo() {
  return (
    <div className="skeu-preview-section">
      <ScrollArea height="120px" className="skeu-preview-scroll-demo">
        <Text size="sm">
          Scrollable content. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua.
        </Text>
      </ScrollArea>
      <div className="skeu-preview-note">
        Use height prop for fixed height. Add hideScrollbars prop to hide
        scrollbars while keeping scroll functionality.
      </div>
    </div>
  );
}
