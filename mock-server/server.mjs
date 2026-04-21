import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "node:http";

const launches = [
  {
    id: "1",
    mission_name: "FalconSat",
    launch_date_local: "2006-03-24T22:30:00+12:00",
    launch_success: false,
    details: "Engine failure at 33 seconds and loss of vehicle. First SpaceX launch attempt.",
    launch_site: { site_name_long: "Kwajalein Atoll Omelek Island" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/94/f2/NN6Ph45r_o.png",
      mission_patch: "https://images2.imgbox.com/40/e3/GypSkayF_o.png",
      article_link: "https://www.space.com/2196-spacex-inaugural-falcon-1-rocket-lost-launch.html",
      video_link: "https://www.youtube.com/watch?v=0a_00nJ_Y88",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 1", rocket_type: "Merlin A", rocket: { description: "The Falcon 1 was an expendable launch system privately developed.", first_flight: "2006-03-24", cost_per_launch: 6700000 } },
  },
  {
    id: "2",
    mission_name: "DemoSat",
    launch_date_local: "2007-03-21T01:10:00+12:00",
    launch_success: false,
    details: "Successful first stage flight and reentry, but second stage did not separate.",
    launch_site: { site_name_long: "Kwajalein Atoll Omelek Island" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/be/e7/iNqsqVYM_o.png",
      mission_patch: "https://images2.imgbox.com/4f/bf/eAfIL7q7_o.png",
      article_link: null,
      video_link: "https://www.youtube.com/watch?v=Lk4zQ2wP-Nc",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 1", rocket_type: "Merlin A", rocket: { description: "The Falcon 1 was an expendable launch system privately developed.", first_flight: "2006-03-24", cost_per_launch: 6700000 } },
  },
  {
    id: "3",
    mission_name: "Trailblazer",
    launch_date_local: "2008-08-03T03:34:00+12:00",
    launch_success: false,
    details: "Residual stage 1 thrust led to collision between stages, destroying the second stage.",
    launch_site: { site_name_long: "Kwajalein Atoll Omelek Island" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/4b/bd/d8UhuuhX_o.png",
      mission_patch: "https://images2.imgbox.com/e9/c9/T8CuqDvM_o.png",
      article_link: null,
      video_link: "https://www.youtube.com/watch?v=v0w9p3U8860",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 1", rocket_type: "Merlin C", rocket: { description: "The Falcon 1 was an expendable launch system privately developed.", first_flight: "2006-03-24", cost_per_launch: 6700000 } },
  },
  {
    id: "4",
    mission_name: "RatSat",
    launch_date_local: "2008-09-28T23:15:00+12:00",
    launch_success: true,
    details: "Ratsat was carried to orbit and the first successful Falcon 1 orbital flight.",
    launch_site: { site_name_long: "Kwajalein Atoll Omelek Island" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/e9/c9/T8CuqDvM_o.png",
      mission_patch: "https://images2.imgbox.com/e9/c9/T8CuqDvM_o.png",
      article_link: null,
      video_link: "https://www.youtube.com/watch?v=dLqDvSIBKFs",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 1", rocket_type: "Merlin C", rocket: { description: "The Falcon 1 was an expendable launch system privately developed.", first_flight: "2006-03-24", cost_per_launch: 6700000 } },
  },
  {
    id: "5",
    mission_name: "RazakSat",
    launch_date_local: "2009-07-13T03:35:00+12:00",
    launch_success: true,
    details: "Launched for Malaysia's ATSB. The mission was successful and the satellite was placed into orbit.",
    launch_site: { site_name_long: "Kwajalein Atoll Omelek Island" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/a7/ba/NBZSw9qs_o.png",
      mission_patch: "https://images2.imgbox.com/a7/ba/NBZSw9qs_o.png",
      article_link: null,
      video_link: "https://www.youtube.com/watch?v=yTaIDooc8Og",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 1", rocket_type: "Merlin C", rocket: { description: "The Falcon 1 was an expendable launch system privately developed.", first_flight: "2006-03-24", cost_per_launch: 6700000 } },
  },
  {
    id: "6",
    mission_name: "Falcon 9 Test Flight",
    launch_date_local: "2010-06-04T18:45:00-04:00",
    launch_success: true,
    details: "First flight of the Falcon 9 rocket. The Dragon capsule mock-up was placed in orbit.",
    launch_site: { site_name_long: "Cape Canaveral, Launch Complex 40" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/f9/4a/ZboXReNb_o.png",
      mission_patch: "https://images2.imgbox.com/f9/4a/ZboXReNb_o.png",
      article_link: "https://www.space.com/8569-spacex-falcon-9-rocket-blasts-off-maiden-launch.html",
      video_link: "https://www.youtube.com/watch?v=nxSxgBKlYws",
      flickr_images: [
        "https://farm1.staticflickr.com/53/167162apprentice_m.jpg",
      ],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "v1.0", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "7",
    mission_name: "COTS 1",
    launch_date_local: "2010-12-08T15:43:00-05:00",
    launch_success: true,
    details: "First demonstration of Dragon spacecraft orbital flight, reentry, and recovery.",
    launch_site: { site_name_long: "Cape Canaveral, Launch Complex 40" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/36/72/pAuTCmAR_o.png",
      mission_patch: "https://images2.imgbox.com/36/72/pAuTCmAR_o.png",
      article_link: "http://www.spacex.com/news/2013/02/11/cots-overview",
      video_link: "https://www.youtube.com/watch?v=giNhaEzv_PI",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "v1.0", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "8",
    mission_name: "COTS 2",
    launch_date_local: "2012-05-22T07:44:38-04:00",
    launch_success: true,
    details: "First private company to successfully launch, orbit, and recover a spacecraft.",
    launch_site: { site_name_long: "Cape Canaveral, Launch Complex 40" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/46/05/qLEA8muv_o.png",
      mission_patch: "https://images2.imgbox.com/46/05/qLEA8muv_o.png",
      article_link: "https://en.wikipedia.org/wiki/Dragon_C2%2B",
      video_link: "https://www.youtube.com/watch?v=2tVWA2QsOeA",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "v1.0", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "9",
    mission_name: "CRS-1",
    launch_date_local: "2012-10-08T20:35:05-04:00",
    launch_success: true,
    details: "First operational Dragon cargo flight. Delivered supplies to ISS.",
    launch_site: { site_name_long: "Cape Canaveral, Launch Complex 40" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/05/dc/xOCGTnPh_o.png",
      mission_patch: "https://images2.imgbox.com/05/dc/xOCGTnPh_o.png",
      article_link: "https://en.wikipedia.org/wiki/SpaceX_CRS-1",
      video_link: "https://www.youtube.com/watch?v=ORIoMFRU8jU",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "v1.0", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "10",
    mission_name: "CRS-2",
    launch_date_local: "2013-03-01T15:10:00-05:00",
    launch_success: true,
    details: "Second operational Dragon cargo flight. Successfully delivered cargo to ISS.",
    launch_site: { site_name_long: "Cape Canaveral, Launch Complex 40" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/f1/f8/mRM6wqgR_o.png",
      mission_patch: "https://images2.imgbox.com/f1/f8/mRM6wqgR_o.png",
      article_link: "https://en.wikipedia.org/wiki/SpaceX_CRS-2",
      video_link: "https://www.youtube.com/watch?v=E4dS1IeNSfg",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "v1.0", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "11",
    mission_name: "CASSIOPE",
    launch_date_local: "2013-09-29T16:00:00-07:00",
    launch_success: true,
    details: "First launch from Vandenberg, SLC-4E. First flight of Falcon 9 v1.1 with reignitable engines.",
    launch_site: { site_name_long: "Vandenberg Air Force Base Space Launch Complex 4E" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/02/55/1ieS2Nxz_o.png",
      mission_patch: "https://images2.imgbox.com/02/55/1ieS2Nxz_o.png",
      article_link: "http://www.spacex.com/news/2013/09/29/falcon-9-successfully-delivers-cassiope-orbit",
      video_link: "https://www.youtube.com/watch?v=_FWIXMnmkp8",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "v1.1", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "12",
    mission_name: "SES-8",
    launch_date_local: "2014-03-05T01:25:00-05:00",
    launch_success: true,
    details: "First Falcon 9 geostationary transfer orbit mission. First relight of upper stage engine.",
    launch_site: { site_name_long: "Cape Canaveral, Launch Complex 40" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/6c/cb/na1tzhHs_o.png",
      mission_patch: "https://images2.imgbox.com/6c/cb/na1tzhHs_o.png",
      article_link: "http://www.spacex.com/news/2014/03/05/ses-8-launch",
      video_link: "https://www.youtube.com/watch?v=HjdAlMbTrqU",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "v1.1", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "13",
    mission_name: "CRS-3",
    launch_date_local: "2014-04-18T19:25:29-04:00",
    launch_success: true,
    details: "Third operational Dragon cargo flight. First attempt at controlled first stage descent.",
    launch_site: { site_name_long: "Cape Canaveral, Launch Complex 40" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/4b/a6/eljkbSNn_o.png",
      mission_patch: "https://images2.imgbox.com/4b/a6/eljkbSNn_o.png",
      article_link: "https://en.wikipedia.org/wiki/SpaceX_CRS-3",
      video_link: "https://www.youtube.com/watch?v=IQ3-oUmr0G4",
      flickr_images: [
        "https://farm8.staticflickr.com/7619/16789815779_f1e2501c7d_o.jpg",
      ],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "v1.1", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "14",
    mission_name: "CRS-5",
    launch_date_local: "2015-01-10T09:47:00-05:00",
    launch_success: true,
    details: "First attempt to land an orbital rocket booster on a drone ship, Just Read the Instructions.",
    launch_site: { site_name_long: "Cape Canaveral, Launch Complex 40" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/18/07/2e5XxOSq_o.png",
      mission_patch: "https://images2.imgbox.com/18/07/2e5XxOSq_o.png",
      article_link: "https://en.wikipedia.org/wiki/SpaceX_CRS-5",
      video_link: "https://www.youtube.com/watch?v=Yd2a9V_aCes",
      flickr_images: [
        "https://farm8.staticflickr.com/7619/16789815779_f1e2501c7d_o.jpg",
      ],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "v1.1", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "15",
    mission_name: "OrbComm OG2 Mission 2",
    launch_date_local: "2015-12-21T20:29:00-05:00",
    launch_success: true,
    details: "First ever successful vertical landing of an orbital rocket booster at Landing Zone 1.",
    launch_site: { site_name_long: "Cape Canaveral, Launch Complex 40" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/be/67/lJMgKqOy_o.png",
      mission_patch: "https://images2.imgbox.com/be/67/lJMgKqOy_o.png",
      article_link: "https://en.wikipedia.org/wiki/OrbComm_OG2_Mission_2",
      video_link: "https://www.youtube.com/watch?v=O5bTbVbe4e4",
      flickr_images: [
        "https://farm1.staticflickr.com/736/23618068073_b74cd5fd07_o.jpg",
        "https://farm6.staticflickr.com/5793/23644653974_8eed2f94aa_o.jpg",
      ],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "16",
    mission_name: "Jason-3",
    launch_date_local: "2016-01-17T10:42:18-08:00",
    launch_success: true,
    details: "Jason-3 is a joint mission of NOAA, CNES, EUMETSAT and NASA.",
    launch_site: { site_name_long: "Vandenberg Air Force Base Space Launch Complex 4E" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/f7/97/rdMl5GiO_o.png",
      mission_patch: "https://images2.imgbox.com/f7/97/rdMl5GiO_o.png",
      article_link: "https://en.wikipedia.org/wiki/Jason-3",
      video_link: "https://www.youtube.com/watch?v=sLgMfbKQCfg",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "17",
    mission_name: "CRS-7",
    launch_date_local: "2015-06-28T14:21:11-04:00",
    launch_success: false,
    details: "Due to an overpressure incident in the helium system, vehicle was lost at T+2:19.",
    launch_site: { site_name_long: "Cape Canaveral, Launch Complex 40" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/58/96/0ZM5lPFl_o.png",
      mission_patch: "https://images2.imgbox.com/58/96/0ZM5lPFl_o.png",
      article_link: "https://en.wikipedia.org/wiki/SpaceX_CRS-7",
      video_link: "https://www.youtube.com/watch?v=PuNymhcTtSQ",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "v1.1", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "18",
    mission_name: "AMOS-6",
    launch_date_local: "2016-09-01T13:07:00-04:00",
    launch_success: false,
    details: "Vehicle and payload lost in an anomaly during propellant fill operations on the launch pad.",
    launch_site: { site_name_long: "Cape Canaveral, Launch Complex 40" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/ce/89/8X8JWt9a_o.png",
      mission_patch: "https://images2.imgbox.com/ce/89/8X8JWt9a_o.png",
      article_link: "https://en.wikipedia.org/wiki/Amos-6",
      video_link: null,
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "19",
    mission_name: "Iridium NEXT Mission 1",
    launch_date_local: "2017-01-14T17:54:00-08:00",
    launch_success: true,
    details: "SpaceX successfully launched 10 Iridium NEXT satellites to low Earth orbit.",
    launch_site: { site_name_long: "Vandenberg Air Force Base Space Launch Complex 4E" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/42/b5/BwCKkuI5_o.png",
      mission_patch: "https://images2.imgbox.com/42/b5/BwCKkuI5_o.png",
      article_link: "https://en.wikipedia.org/wiki/Iridium_satellite_constellation",
      video_link: "https://www.youtube.com/watch?v=lOqCsHkJ6oM",
      flickr_images: [
        "https://farm1.staticflickr.com/664/32791503631_ce352a47f3_o.jpg",
      ],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "20",
    mission_name: "CRS-10",
    launch_date_local: "2017-02-19T14:58:00-05:00",
    launch_success: true,
    details: "SpaceX's tenth mission to the International Space Station under the CRS contract.",
    launch_site: { site_name_long: "Kennedy Space Center Launch Complex 39A" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/a1/d6/ZthSBCjC_o.png",
      mission_patch: "https://images2.imgbox.com/a1/d6/ZthSBCjC_o.png",
      article_link: "https://en.wikipedia.org/wiki/SpaceX_CRS-10",
      video_link: "https://www.youtube.com/watch?v=giNhaEzv_PI",
      flickr_images: [
        "https://farm3.staticflickr.com/2826/33116887685_cdc67e3ef0_o.jpg",
        "https://farm4.staticflickr.com/3863/33116887685_cdc67e3ef0_o.jpg",
      ],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "21",
    mission_name: "Echostar 23",
    launch_date_local: "2017-03-16T06:00:00-04:00",
    launch_success: true,
    details: "Launched a communications satellite for Echostar to geostationary orbit.",
    launch_site: { site_name_long: "Kennedy Space Center Launch Complex 39A" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/a0/20/cqSmYcDi_o.png",
      mission_patch: "https://images2.imgbox.com/a0/20/cqSmYcDi_o.png",
      article_link: "https://en.wikipedia.org/wiki/EchoStar_23",
      video_link: "https://www.youtube.com/watch?v=xWOqCRTAVlE",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "22",
    mission_name: "SES-10",
    launch_date_local: "2017-03-30T22:27:00-04:00",
    launch_success: true,
    details: "First reflight of an orbital rocket booster using a flight-proven Falcon 9 first stage.",
    launch_site: { site_name_long: "Kennedy Space Center Launch Complex 39A" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/a0/a5/Kr7HKHVo_o.png",
      mission_patch: "https://images2.imgbox.com/a0/a5/Kr7HKHVo_o.png",
      article_link: "https://en.wikipedia.org/wiki/SES-10",
      video_link: "https://www.youtube.com/watch?v=giNhaEzv_PI",
      flickr_images: [
        "https://farm3.staticflickr.com/2848/33838735954_92e02b8e0b_o.jpg",
      ],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "23",
    mission_name: "NROL-76",
    launch_date_local: "2017-05-01T07:15:00-04:00",
    launch_success: true,
    details: "Classified mission launched for the National Reconnaissance Office.",
    launch_site: { site_name_long: "Kennedy Space Center Launch Complex 39A" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/d5/07/t1cEAFdG_o.png",
      mission_patch: "https://images2.imgbox.com/d5/07/t1cEAFdG_o.png",
      article_link: null,
      video_link: "https://www.youtube.com/watch?v=ay1L6KCXbaE",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "24",
    mission_name: "Inmarsat-5 F4",
    launch_date_local: "2017-05-15T23:21:00-04:00",
    launch_success: true,
    details: "Launch of fourth and final Inmarsat 5 satellite for Global Xpress broadband network.",
    launch_site: { site_name_long: "Kennedy Space Center Launch Complex 39A" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/40/d6/kLBnMrCk_o.png",
      mission_patch: "https://images2.imgbox.com/40/d6/kLBnMrCk_o.png",
      article_link: "https://en.wikipedia.org/wiki/Inmarsat-5_F4",
      video_link: "https://www.youtube.com/watch?v=ggDKkFcnGaE",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "25",
    mission_name: "CRS-11",
    launch_date_local: "2017-06-03T21:07:00-04:00",
    launch_success: true,
    details: "Reused Dragon capsule flew for the second time. First reuse of Dragon spacecraft.",
    launch_site: { site_name_long: "Kennedy Space Center Launch Complex 39A" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/71/29/EE02TLBW_o.png",
      mission_patch: "https://images2.imgbox.com/71/29/EE02TLBW_o.png",
      article_link: "https://en.wikipedia.org/wiki/SpaceX_CRS-11",
      video_link: "https://www.youtube.com/watch?v=ikYMwMGWgaM",
      flickr_images: [
        "https://farm5.staticflickr.com/4198/34081949104_c7a1dcb72f_o.jpg",
      ],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "26",
    mission_name: "Crew Dragon Demo-2",
    launch_date_local: "2020-05-30T15:22:00-04:00",
    launch_success: true,
    details: "First crewed Crew Dragon flight. NASA astronauts Bob Behnken and Doug Hurley flew to the ISS.",
    launch_site: { site_name_long: "Kennedy Space Center Launch Complex 39A" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/53/d2/jGFVbWTy_o.png",
      mission_patch: "https://images2.imgbox.com/53/d2/jGFVbWTy_o.png",
      article_link: "https://www.nasa.gov/commercialcrew/dm2",
      video_link: "https://www.youtube.com/watch?v=giNhaEzv_PI",
      flickr_images: [
        "https://farm8.staticflickr.com/7874/49930578893_d2a4619a39_o.jpg",
        "https://farm8.staticflickr.com/7907/49930578023_1597f6d694_o.jpg",
      ],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "27",
    mission_name: "Starlink 1 v1.0",
    launch_date_local: "2019-05-24T02:30:00-04:00",
    launch_success: true,
    details: "First batch of 60 Starlink v1.0 satellites launched to LEO.",
    launch_site: { site_name_long: "Cape Canaveral, Launch Complex 40" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/d2/3b/bQaWiil0_o.png",
      mission_patch: "https://images2.imgbox.com/d2/3b/bQaWiil0_o.png",
      article_link: "https://www.space.com/starlink-first-launch",
      video_link: "https://www.youtube.com/watch?v=giNhaEzv_PI",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "28",
    mission_name: "Inspiration4",
    launch_date_local: "2021-09-15T20:02:00-04:00",
    launch_success: true,
    details: "First all-civilian orbital spaceflight, raising funds for St. Jude Children's Research Hospital.",
    launch_site: { site_name_long: "Kennedy Space Center Launch Complex 39A" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/8c/44/XXCL8TrJ_o.png",
      mission_patch: "https://images2.imgbox.com/8c/44/XXCL8TrJ_o.png",
      article_link: "https://www.space.com/inspiration4",
      video_link: "https://www.youtube.com/watch?v=giNhaEzv_PI",
      flickr_images: [
        "https://farm9.staticflickr.com/8701/28638137393_63a28b2c21_o.jpg",
      ],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "29",
    mission_name: "Transporter-3",
    launch_date_local: "2022-01-13T10:25:00-05:00",
    launch_success: true,
    details: "SpaceX launched its third dedicated SmallSat Rideshare Program mission with 105 payloads.",
    launch_site: { site_name_long: "Cape Canaveral, Space Launch Complex 40" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/8d/fc/0qdFYWEN_o.png",
      mission_patch: "https://images2.imgbox.com/8d/fc/0qdFYWEN_o.png",
      article_link: "https://www.space.com/transporter-3",
      video_link: "https://www.youtube.com/watch?v=giNhaEzv_PI",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "30",
    mission_name: "NROL-87",
    launch_date_local: "2022-02-02T14:32:00-08:00",
    launch_success: true,
    details: "SpaceX launched a classified payload for the National Reconnaissance Office from Vandenberg.",
    launch_site: { site_name_long: "Vandenberg Space Force Base, Space Launch Complex 4E" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/7f/5e/p6XSgCOo_o.png",
      mission_patch: "https://images2.imgbox.com/7f/5e/p6XSgCOo_o.png",
      article_link: "https://www.space.com/nrol-87-launch",
      video_link: "https://www.youtube.com/watch?v=giNhaEzv_PI",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
  {
    id: "31",
    mission_name: "Starlink 4-1 (v1.5)",
    launch_date_local: "2022-02-03T15:13:00-05:00",
    launch_success: true,
    details: "SpaceX launched another batch of 49 Starlink v1.5 satellites into low Earth orbit.",
    launch_site: { site_name_long: "Cape Canaveral, Space Launch Complex 40" },
    links: {
      mission_patch_small: "https://images2.imgbox.com/d2/3b/bQaWiil0_o.png",
      mission_patch: "https://images2.imgbox.com/d2/3b/bQaWiil0_o.png",
      article_link: "https://www.space.com/starlink-launch-2022",
      video_link: "https://www.youtube.com/watch?v=giNhaEzv_PI",
      flickr_images: [],
    },
    rocket: { rocket_name: "Falcon 9", rocket_type: "Full Thrust", rocket: { description: "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX.", first_flight: "2010-06-04", cost_per_launch: 50000000 } },
  },
];

const typeDefs = /* GraphQL */ `
  type LaunchSite {
    site_name_long: String
  }

  type LaunchLinks {
    mission_patch_small: String
    mission_patch: String
    article_link: String
    video_link: String
    flickr_images: [String]
  }

  type RocketDetails {
    description: String
    first_flight: String
    cost_per_launch: Int
  }

  type LaunchRocket {
    rocket_name: String
    rocket_type: String
    rocket: RocketDetails
  }

  type Launch {
    id: ID!
    mission_name: String
    launch_date_local: String
    launch_success: Boolean
    details: String
    launch_site: LaunchSite
    links: LaunchLinks
    rocket: LaunchRocket
  }

  input LaunchFind {
    mission_name: String
    launch_success: Boolean
    rocket_name: String
  }

  type Query {
    launches(limit: Int, offset: Int, find: LaunchFind): [Launch]
    launch(id: ID!): Launch
    launchesCount(find: LaunchFind): Int!
  }
`;

const resolvers = {
  Query: {
    launches: (_parent, { limit, offset = 0, find }) => {
      let filtered = [...launches];

      if (find) {
        if (find.mission_name) {
          const search = find.mission_name.toLowerCase();
          filtered = filtered.filter((l) =>
            l.mission_name.toLowerCase().includes(search)
          );
        }
        if (find.launch_success !== undefined && find.launch_success !== null) {
          filtered = filtered.filter(
            (l) => l.launch_success === find.launch_success
          );
        }
        if (find.rocket_name) {
          const rocketSearch = find.rocket_name.toLowerCase();
          filtered = filtered.filter((l) =>
            l.rocket?.rocket_name?.toLowerCase().includes(rocketSearch)
          );
        }
      }

      // Only apply limit/offset when limit is explicitly provided
      // This lets GET_LAUNCHES_COUNT work correctly without a limit arg
      if (limit != null) {
        return filtered.slice(offset, offset + limit);
      }
      return filtered.slice(offset);
    },
    launch: (_parent, { id }) => launches.find((l) => l.id === id) ?? null,
    launchesCount: (_parent, { find }) => {
      let filtered = [...launches];
      if (find) {
        if (find.mission_name) {
          const search = find.mission_name.toLowerCase();
          filtered = filtered.filter((l) =>
            l.mission_name.toLowerCase().includes(search)
          );
        }
        if (find.launch_success !== undefined && find.launch_success !== null) {
          filtered = filtered.filter(
            (l) => l.launch_success === find.launch_success
          );
        }
        if (find.rocket_name) {
          const rocketSearch = find.rocket_name.toLowerCase();
          filtered = filtered.filter((l) =>
            l.rocket?.rocket_name?.toLowerCase().includes(rocketSearch)
          );
        }
      }
      return filtered.length;
    },
  },
};

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
  },
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.log("Mock SpaceX GraphQL server → http://localhost:4000/graphql");
  console.log(`Total launches in dataset: ${launches.length}`);
});
