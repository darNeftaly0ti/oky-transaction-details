// SpaceX API TypeScript interfaces for OKY Wallet Transaction Explorer

export interface RocketDetails {
  description: string | null;
  first_flight: string | null;
  cost_per_launch: number | null;
}

export interface Rocket {
  rocket_name: string;
  rocket_type: string;
  rocket?: RocketDetails | null;
}

export interface LaunchLinks {
  mission_patch_small: string | null;
  mission_patch: string | null;
  article_link: string | null;
  video_link: string | null;
  flickr_images: string[] | null;
}

export interface LaunchSite {
  site_name_long: string;
}

export interface Launch {
  id: string;
  mission_name: string;
  launch_date_local: string;
  launch_success: boolean | null;
  details: string | null;
  launch_site: LaunchSite | null;
  links: LaunchLinks | null;
  rocket: Rocket | null;
}

// Query response types
export interface LaunchesData {
  launches: Launch[];
}

export interface LaunchData {
  launch: Launch;
}

// Query variable types
export interface LaunchFind {
  mission_name?: string;
  launch_success?: boolean;
  rocket_name?: string;
}

export interface LaunchesVars {
  limit?: number;
  offset?: number;
  find?: LaunchFind;
}

export interface LaunchVars {
  id: string;
}

export interface LaunchesCountData {
  launchesCount: number;
}

export interface StatsData {
  total: number;
  successful: number;
  failed: number;
}
