import { ActionIcon, Button, useMantineTheme } from '@mantine/core';
import { IconBookmark } from '@tabler/icons';
import toast from 'react-hot-toast';
import { updateBookmark } from 'services/mutator';
import { useSWRConfig } from 'swr';
import { SWR_USER_KEY, useSession } from 'utils';
import useNeedLoginDialog from 'utils/hooks/useNeedLoginDialog';

type Props = {
  mangaId: string;
  onlyIcon?: boolean;
  classes?: string;
  uploadBy?: string;
};

const BookmarkButton = ({ mangaId, onlyIcon, classes, uploadBy }: Props) => {
  const theme = useMantineTheme();
  const { user } = useSession();
  const { mutate } = useSWRConfig();

  const { show } = useNeedLoginDialog();

  const isBookmarked = user?.bookmark?.includes(mangaId);

  const onClick = () => {
    if (user) {
      try {
        toast.promise(updateBookmark(mangaId, isBookmarked, user), {
          loading: 'Đang cập nhật danh sách theo dõi...',
          success: () => {
            mutate('api_user');

            if (user) {
              mutate(SWR_USER_KEY.BOOKMARK);
            }

            return isBookmarked ? 'Bỏ theo dõi thành công' : 'Đã theo dõi';
          },
          error: 'Có lỗi xảy ra ;_;',
        });
      } catch (error) {}
    } else {
      show();
    }
  };

  return onlyIcon ? (
    <ActionIcon className={classes} aria-label="Theo dõi truyện" disabled={user?.id === uploadBy} onClick={onClick}>
      <IconBookmark
        size={16}
        color={theme.colors.yellow[7]}
        fill={isBookmarked ? theme.colors.yellow[7] : 'transparent'}
      />
    </ActionIcon>
  ) : (
    <Button
      variant="outline"
      color="yellow.7"
      disabled={user?.id === uploadBy}
      onClick={onClick}
      leftIcon={<IconBookmark size={18} fill={isBookmarked ? theme.colors.yellow[7] : 'transparent'} />}
    >
      {isBookmarked ? 'Bỏ theo dõi' : 'Theo dõi truyện'}
    </Button>
  );
};

export default BookmarkButton;
