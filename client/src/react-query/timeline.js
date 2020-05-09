import { useInfiniteQuery } from 'react-query';
import { getTimeline } from '../api/timeline';
import { pageSize } from '../config/env';

const fetchTimeline = (key, page = 1) => {
  return getTimeline(page);
};

export const useTimelineQuery = () => {
  return useInfiniteQuery('timeline', fetchTimeline, {
    getFetchMore: (lastGroup, allGroups) => {
      if (lastGroup.length === pageSize) {
        return allGroups.length + 1;
      }
      return 0;
    },
  });
};
