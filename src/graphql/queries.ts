import { gql } from "@apollo/client";

export const GET_LAUNCHES = gql`
  query GetLaunches($limit: Int, $offset: Int, $find: LaunchFind) {
    launches(limit: $limit, offset: $offset, find: $find) {
      id
      mission_name
      launch_date_local
      launch_success
      details
      launch_site {
        site_name_long
      }
      links {
        mission_patch_small
        article_link
        video_link
      }
      rocket {
        rocket_name
        rocket_type
      }
    }
  }
`;

export const GET_LAUNCH = gql`
  query GetLaunch($id: ID!) {
    launch(id: $id) {
      id
      mission_name
      launch_date_local
      launch_success
      details
      launch_site {
        site_name_long
      }
      links {
        mission_patch_small
        mission_patch
        article_link
        video_link
        flickr_images
      }
      rocket {
        rocket_name
        rocket_type
        rocket {
          description
          first_flight
          cost_per_launch
        }
      }
    }
  }
`;

export const GET_LAUNCHES_COUNT = gql`
  query GetLaunchesCount($find: LaunchFind) {
    launchesCount(find: $find)
  }
`;

export const GET_STATS = gql`
  query GetStats {
    total: launchesCount
    successful: launchesCount(find: { launch_success: true })
    failed: launchesCount(find: { launch_success: false })
  }
`;
