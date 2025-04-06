import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';

// Sample array of objects
const places = [
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "FVX3+M7M, Saras Baug Rd, opp. Sanas Play Ground, Vijayanagar Colony, Sadashiv Peth, Pune, Maharashtra 411030, India",
        "geometry": {
            "location": {
                "lat": 18.5029742,
                "lng": 73.8522545
            },
            "viewport": {
                "northeast": {
                    "lat": 18.50434632989272,
                    "lng": 73.85359872989272
                },
                "southwest": {
                    "lat": 18.50164667010728,
                    "lng": 73.85089907010727
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/hospital-71.png",
        "icon_background_color": "#F88181",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/hospital-H_pinlet",
        "name": "Apollo Spectra Hospitals",
        "opening_hours": {
            "open_now": true
        },
        "photos": [
            {
                "height": 640,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/111620302976809660012\">Nova Specialty Hospitals - Saras-Baug</a>"
                ],
                "photo_reference": "AVzFdbmKo9Rx6qySEHi5Q6znzYHQaRcRtgFvaPT1AYg8SkK2Nuv_5HK6aR_CDRtJOjepJdKINuYXW6vuHVxqjR8Xj-n91Z1pErKVjjzoxRLk7NnWI-n_2DbPJLdzOypmK3cC5BsJGnvUO9mIdogkU-Zz0dTcxvFU_hIsfYVbGGLpREJRkF0x",
                "width": 970
            }
        ],
        "place_id": "ChIJCVq-mA3AwjsRUzKAs5tjuo0",
        "rating": 4.6,
        "reference": "ChIJCVq-mA3AwjsRUzKAs5tjuo0",
        "types": [
            "hospital",
            "doctor",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 3477
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "Western Avenue Society, near Jaugar Showroom, Wakad, Pune, Maharashtra 411057, India",
        "geometry": {
            "location": {
                "lat": 18.6016693,
                "lng": 73.75581339999999
            },
            "viewport": {
                "northeast": {
                    "lat": 18.60301897989272,
                    "lng": 73.75716437989273
                },
                "southwest": {
                    "lat": 18.60031932010727,
                    "lng": 73.75446472010728
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        "icon_background_color": "#7B9EB0",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        "name": "Apollo WA society Clinic",
        "opening_hours": {
            "open_now": false
        },
        "place_id": "ChIJDTps5Xm5wjsRDip0xZYp_2E",
        "plus_code": {
            "compound_code": "JQ24+M8 Pune, Maharashtra",
            "global_code": "7JCMJQ24+M8"
        },
        "rating": 3.5,
        "reference": "ChIJDTps5Xm5wjsRDip0xZYp_2E",
        "types": [
            "hospital",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 4
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "Shop # 14 -20, Citi Pride Complex, below kotak mahindra bank, next to Sant Dyaneshwar Chowk, Sector 25, Pradhikaran, Nigdi, Pune, Pimpri-Chinchwad, Maharashtra 411044, India",
        "geometry": {
            "location": {
                "lat": 18.6561993,
                "lng": 73.7699231
            },
            "viewport": {
                "northeast": {
                    "lat": 18.65755847989272,
                    "lng": 73.77133082989273
                },
                "southwest": {
                    "lat": 18.65485882010728,
                    "lng": 73.76863117010728
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        "icon_background_color": "#7B9EB0",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        "name": "Apollo Clinic",
        "opening_hours": {
            "open_now": false
        },
        "photos": [
            {
                "height": 2448,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/104359855154084279859\">Vaibhav Mestry</a>"
                ],
                "photo_reference": "AVzFdbkxIbATAB0FmN2_ljYariMruMASVvuzvmiAOTo-a40OkExP1FpwMkq06ad0ZmslIpjAt-uFdWqBY8f0gdVf1IbvdgzN-2JLNs6Jby7mwm-6s-e_gJTz06bIpVNZ0B5qkTEXVKDXQKn-B4T22qWtnqJLhI7DINL8AD7ZnHQHWfruGGVq",
                "width": 3264
            }
        ],
        "place_id": "ChIJ6YNKleC5wjsRWiy5pNgLEHQ",
        "plus_code": {
            "compound_code": "MQ49+FX Nigdi, Pimpri-Chinchwad, Maharashtra",
            "global_code": "7JCMMQ49+FX"
        },
        "rating": 4.6,
        "reference": "ChIJ6YNKleC5wjsRWiy5pNgLEHQ",
        "types": [
            "hospital",
            "physiotherapist",
            "doctor",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 1671
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "Blue Ridge Town Pune, Phase 1, Hinjawadi Rajiv Gandhi Infotech Park, Hinjawadi, Pimpri-Chinchwad, Maharashtra 411057, India",
        "geometry": {
            "location": {
                "lat": 18.5753892,
                "lng": 73.7407259
            },
            "viewport": {
                "northeast": {
                    "lat": 18.57668107989272,
                    "lng": 73.74210527989273
                },
                "southwest": {
                    "lat": 18.57398142010728,
                    "lng": 73.73940562010728
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/hospital-71.png",
        "icon_background_color": "#F88181",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/hospital-H_pinlet",
        "name": "Apollo Clinic",
        "opening_hours": {
            "open_now": false
        },
        "photos": [
            {
                "height": 3024,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/108351626607730584029\">Hrishikesh Kadam</a>"
                ],
                "photo_reference": "AVzFdbm4GyRp15bI9KpmDeMlB6Xax-_vVOFIBMPLfsF1jlGNdi4KHf-kXpgLdUd22GfIyxQRnyH5z1XoJhvaahGGLV1njBp2SszIc-ewGTVK4LlchLQFK-on3KBuFvoPCC6qJ4xtYJ5kv-1dB9Gf6S-_5V7RiVhP4wO2RLfqVqeBK1P-lHiY",
                "width": 4032
            }
        ],
        "place_id": "ChIJe_Fi1hi7wjsRoMxWipt_2Q8",
        "plus_code": {
            "compound_code": "HPGR+57 Pimpri-Chinchwad, Maharashtra",
            "global_code": "7JCMHPGR+57"
        },
        "rating": 3.7,
        "reference": "ChIJe_Fi1hi7wjsRoMxWipt_2Q8",
        "types": [
            "hospital",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 7
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "Plot #13, Parsik Hill Rd, off Uran Road, opp. Nerul Wonders Park, Sector 23, CBD Belapur, Navi Mumbai, Maharashtra 400614, India",
        "geometry": {
            "location": {
                "lat": 19.0206741,
                "lng": 73.02910199999999
            },
            "viewport": {
                "northeast": {
                    "lat": 19.02193202989272,
                    "lng": 73.03021207989272
                },
                "southwest": {
                    "lat": 19.01923237010728,
                    "lng": 73.02751242010727
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/hospital-71.png",
        "icon_background_color": "#F88181",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/hospital-H_pinlet",
        "name": "Apollo Hospital, Navi Mumbai",
        "opening_hours": {
            "open_now": true
        },
        "photos": [
            {
                "height": 2639,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/100812811308278903813\">Naveen Singh</a>"
                ],
                "photo_reference": "AVzFdbl6--JmfEOph82prvkSf8dU5sBwAOq1DVlmeJyah0URZ4M6YjqzMkWwrrAorBN0wLnX1i9JIRkn5pjQ3Mybw3cg4Cpi_86yqlfGnbTw1XD3ctK0PW8YhMM8ODJJQUJcMMDNW-3PxouX6YAv78wn9Dj6TMjop0TO7FfPB3r5_L1dTUOm",
                "width": 4096
            }
        ],
        "place_id": "ChIJl5I8OpDD5zsRBWCFNF2iWLg",
        "plus_code": {
            "compound_code": "22CH+7J Navi Mumbai, Maharashtra",
            "global_code": "7JFM22CH+7J"
        },
        "rating": 4.7,
        "reference": "ChIJl5I8OpDD5zsRBWCFNF2iWLg",
        "types": [
            "hospital",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 19157
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "Centriole Building, 130, ITI Rd, above Star Bucks coffee, Anand Park, Aundh, Pune, Maharashtra 411007, India",
        "geometry": {
            "location": {
                "lat": 18.5566858,
                "lng": 73.8087644
            },
            "viewport": {
                "northeast": {
                    "lat": 18.55803022989272,
                    "lng": 73.81031357989274
                },
                "southwest": {
                    "lat": 18.55533057010728,
                    "lng": 73.80761392010729
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        "icon_background_color": "#7B9EB0",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        "name": "Apollo Clinic",
        "opening_hours": {
            "open_now": false
        },
        "photos": [
            {
                "height": 2560,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/114555550915877372472\">Apollo Clinic</a>"
                ],
                "photo_reference": "AVzFdbmcBnPZ3tq6XdsAxlncxxkO67pAI2hTQi3wTl1GYzVheWJD1ZyG65XTtKKfDFkXIGl399_kxrgu234IT24VCq6iS_wfSehmeSP9aXuDOqWInqyvBIdxcDONVmY6EbOGC9r_Afbb-l-uPju0xa0C7-eZmTqpy9qbEJUVfweI3PFPQ2rD",
                "width": 1920
            }
        ],
        "place_id": "ChIJg0hJBTu_wjsRh9TBbgfExPw",
        "plus_code": {
            "compound_code": "HR45+MG Pune, Maharashtra",
            "global_code": "7JCMHR45+MG"
        },
        "rating": 4.5,
        "reference": "ChIJg0hJBTu_wjsRh9TBbgfExPw",
        "types": [
            "physiotherapist",
            "doctor",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 1809
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "Shop NO 101 R 6 SURVEY NO.74, R6 Tower MARUNJI Marunji-Karsarsai, Road, Hinjawadi, Mulshi, PCMC, Maharashtra 411057, India",
        "geometry": {
            "location": {
                "lat": 18.6223401,
                "lng": 73.7151215
            },
            "viewport": {
                "northeast": {
                    "lat": 18.62375512989273,
                    "lng": 73.71650342989271
                },
                "southwest": {
                    "lat": 18.62105547010728,
                    "lng": 73.71380377010726
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/hospital-71.png",
        "icon_background_color": "#F88181",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/hospital-H_pinlet",
        "name": "Apollo Life Republic Society Clinic",
        "opening_hours": {
            "open_now": false
        },
        "photos": [
            {
                "height": 960,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/100329963166894920429\">A Google User</a>"
                ],
                "photo_reference": "AVzFdblRM_hGSLAxRZU7jdHttXKDT07CRafTeksmuXockfBqw_RBXHi3HBi1eQuB9fUVEQBF0J05nSwQmSNfgIQ6lhxeht3Tw9JUoRdvlmE1UHNrEqQpDNxDcaz-xMj3Rd0rN-Su_RLpc46mDBG3AjtJ1b4jBthuOzg4aT-MECXRUIaQqdYm",
                "width": 1280
            }
        ],
        "place_id": "ChIJWzJy-lu7wjsRdH109qozWaw",
        "plus_code": {
            "compound_code": "JPC8+W2 Pimpri-Chinchwad, Maharashtra",
            "global_code": "7JCMJPC8+W2"
        },
        "rating": 5,
        "reference": "ChIJWzJy-lu7wjsRdH109qozWaw",
        "types": [
            "hospital",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 6
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "Shop No 1, Bappa Residency, Sakhare Vasti Rd, Phase 1, Hinjawadi Village, Hinjawadi, Pune, Pimpri-Chinchwad, Maharashtra 411057, India",
        "geometry": {
            "location": {
                "lat": 18.5874626,
                "lng": 73.74191999999999
            },
            "viewport": {
                "northeast": {
                    "lat": 18.58878192989272,
                    "lng": 73.74321012989272
                },
                "southwest": {
                    "lat": 18.58608227010728,
                    "lng": 73.74051047010727
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        "icon_background_color": "#7B9EB0",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        "name": "Apollo Diagnostics",
        "opening_hours": {
            "open_now": true
        },
        "photos": [
            {
                "height": 5400,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/114938845988508690749\">A Google User</a>"
                ],
                "photo_reference": "AVzFdbnd2z9Sj4e8ByZEQUKHwKKi_31DVDs1TB40FrIkTLkZx9VscnH3ggcPxYtq3WXJvdJjAR9Ufyg3HCtMPPH4NIlR9pLYQU65eZwiKPdfhtyJ11qXj7aK649oc_aQzsYk5DJdy87A6xSJMqC18SUTWFfmsaGVg0oUOOHA_Z_CSNholk0f",
                "width": 7200
            }
        ],
        "place_id": "ChIJl1TrUQK7wjsRlXGrGg-ytc0",
        "plus_code": {
            "compound_code": "HPPR+XQ Pune, Maharashtra",
            "global_code": "7JCMHPPR+XQ"
        },
        "rating": 0,
        "reference": "ChIJl1TrUQK7wjsRlXGrGg-ytc0",
        "types": [
            "hospital",
            "doctor",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 0
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "01, Yognanda shoppings, Laxmi Chauk, Hinjewadi phase 1, Hinjawadi Marunji Rd, Pune, Maharashtra 411057, India",
        "geometry": {
            "location": {
                "lat": 18.6033891,
                "lng": 73.7300518
            },
            "viewport": {
                "northeast": {
                    "lat": 18.60478567989272,
                    "lng": 73.73143147989272
                },
                "southwest": {
                    "lat": 18.60208602010728,
                    "lng": 73.72873182010727
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        "icon_background_color": "#7B9EB0",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        "name": "Apollo Diagnostics",
        "opening_hours": {
            "open_now": true
        },
        "photos": [
            {
                "height": 813,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/104025607824775302375\">A Google User</a>"
                ],
                "photo_reference": "AVzFdbl3eLHx4ZInB0dZnikdDBD9LP24paU8wKlxNjVRvQ5X7Do1-GFpTk9clKLT5X7-xJ7mzaq8zm9QmOZu52oY2X0q3o8p-rh0VkUyqLG5YdON7xisp1wXLyDLMtsynA9jx3Ht9dRzPATCj_Q_Z4YZ6hqlGaenQQZNOlWM_HytH176sR49",
                "width": 1080
            }
        ],
        "place_id": "ChIJH9AF7fe7wjsRWy_j3p7xQn4",
        "plus_code": {
            "compound_code": "JP3J+92 Pune, Maharashtra",
            "global_code": "7JCMJP3J+92"
        },
        "rating": 5,
        "reference": "ChIJH9AF7fe7wjsRWy_j3p7xQn4",
        "types": [
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 1
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "Shop No, 31, Blue Ridge Approach Road, Township, Phase 1, Hinjawadi Rajiv Gandhi Infotech Park, Hinjawadi, Pune, Pimpri-Chinchwad, Maharashtra 411057, India",
        "geometry": {
            "location": {
                "lat": 18.5802882,
                "lng": 73.73602289999999
            },
            "viewport": {
                "northeast": {
                    "lat": 18.58163647989272,
                    "lng": 73.73735852989273
                },
                "southwest": {
                    "lat": 18.57893682010728,
                    "lng": 73.73465887010728
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        "icon_background_color": "#7B9EB0",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        "name": "Apollo Diagnostics",
        "opening_hours": {
            "open_now": false
        },
        "photos": [
            {
                "height": 4608,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/109267271249513932420\">Pavan Chauhan</a>"
                ],
                "photo_reference": "AVzFdblj576BBn9Cw2sT2h240gtsnA1c--Zx-Xs7GKGjnc8xGAbFEJqzS2LNULRrXDGoeIRYRVZL7HU7AU9ze2tCaak_zgAg382aF4wmb2-z5xQqOM-9lQfsiM4tnOoQTy6Hx2Glkxh5Zpx3fGUBLswBsPTW8Od1DhGky0KidGNI-1lRmXY5",
                "width": 3456
            }
        ],
        "place_id": "ChIJIS67QFK7wjsRNwEHG8_2Rx0",
        "plus_code": {
            "compound_code": "HPJP+4C Pune, Maharashtra",
            "global_code": "7JCMHPJP+4C"
        },
        "rating": 4,
        "reference": "ChIJIS67QFK7wjsRNwEHG8_2Rx0",
        "types": [
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 24
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "Ground Nyati Millenium Premises S1 Datta Mandir Chowk, Viman Nagar, Pune, Maharashtra 411014, India",
        "geometry": {
            "location": {
                "lat": 18.564464,
                "lng": 73.91394199999999
            },
            "viewport": {
                "northeast": {
                    "lat": 18.56580412989272,
                    "lng": 73.91539117989271
                },
                "southwest": {
                    "lat": 18.56310447010728,
                    "lng": 73.91269152010726
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        "icon_background_color": "#7B9EB0",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        "name": "Apollo Clinic",
        "opening_hours": {
            "open_now": false
        },
        "photos": [
            {
                "height": 4608,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/106545443162016412530\">Chandrabhan yadav</a>"
                ],
                "photo_reference": "AVzFdbk4Fp9ga_sbQmY4bd-UiMlVjtsXAjvuqj5Jgg2SSZKZZeOsFu6qeiGD8p7a1fPDgQdWv-_VeYMQNTc998RzKZWgZIXnLznuvjARhQZitb2fyfRB-JmcOdzSOnH7yKl7y0vs_5Jfvu0Vs_3FInu6qW_2jEytxhQpvlMXCpHEFYR_1A-v",
                "width": 3456
            }
        ],
        "place_id": "ChIJ9a6DR0fBwjsRfu-a25FMWME",
        "plus_code": {
            "compound_code": "HW77+QH Pune, Maharashtra",
            "global_code": "7JCMHW77+QH"
        },
        "rating": 4.6,
        "reference": "ChIJ9a6DR0fBwjsRfu-a25FMWME",
        "types": [
            "physiotherapist",
            "doctor",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 4680
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "Amba Vatika, Plot B-1, B G Lonkar Rd, near Café Coffee Day, Kubera Garden, Kondhwa, Pune, Maharashtra 411048, India",
        "geometry": {
            "location": {
                "lat": 18.4790433,
                "lng": 73.89608419999999
            },
            "viewport": {
                "northeast": {
                    "lat": 18.48039972989272,
                    "lng": 73.89743402989271
                },
                "southwest": {
                    "lat": 18.47770007010728,
                    "lng": 73.89473437010727
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        "icon_background_color": "#7B9EB0",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        "name": "Apollo Clinic",
        "opening_hours": {
            "open_now": false
        },
        "photos": [
            {
                "height": 1280,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/102854476903260291473\">Ahlladmin Apollo</a>"
                ],
                "photo_reference": "AVzFdbnLdKN4ZCVw6h-cligBVROwFvu3s58RmwgDQJyw29Py9MlEqR_iYRwYFE_K7FmSwvEDHoXI0mMUSaDyu_WpEFiq_RMz957hPxittOMfgqN8h_8u40nVIwKUnix94A5xrdPLACywuypVtEFpvtJxUKAjMwoDXcD7Pnts-8JpyFToqlKy",
                "width": 768
            }
        ],
        "place_id": "ChIJiyPnmHvqwjsRv5Oq6oCOFb4",
        "plus_code": {
            "compound_code": "FVHW+JC Pune, Maharashtra",
            "global_code": "7JCMFVHW+JC"
        },
        "rating": 4.5,
        "reference": "ChIJiyPnmHvqwjsRv5Oq6oCOFb4",
        "types": [
            "doctor",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 1445
    },
    {
        "business_status": "CLOSED_TEMPORARILY",
        "formatted_address": "Infosys Ph2, Hinjawadi Phase II, Hinjawadi Rajiv Gandhi Infotech Park, Hinjawadi, Pimpri-Chinchwad, Maharashtra 411057, India",
        "geometry": {
            "location": {
                "lat": 18.5926587,
                "lng": 73.7068792
            },
            "viewport": {
                "northeast": {
                    "lat": 18.59397917989272,
                    "lng": 73.70817202989272
                },
                "southwest": {
                    "lat": 18.59127952010727,
                    "lng": 73.70547237010729
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        "icon_background_color": "#7B9EB0",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        "name": "Apollo clinic",
        "permanently_closed": true,
        "photos": [
            {
                "height": 4160,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/110824264500315362907\">Beyond Ordinary!!</a>"
                ],
                "photo_reference": "AVzFdbloLh5XfhsiYnAHQ5-3KYs-4yLvTlBrkGqbFWIjwK50HVPooqSO4lWO3HdxOPco5o2Fl9V1Sm34IfH80diqv7gQnoJ_yaDnYd1yV5Kn_sEU6FqdK6gfwE5Bgy3rLWJMSB6rv0GVLosIGUgzp9447LnASrK6Kcn58NOMCDHdWUFyH8tx",
                "width": 3120
            }
        ],
        "place_id": "ChIJATFQmUW7wjsRg0Ax7_C3NrY",
        "plus_code": {
            "compound_code": "HPV4+3P Pimpri-Chinchwad, Maharashtra",
            "global_code": "7JCMHPV4+3P"
        },
        "rating": 2.6,
        "reference": "ChIJATFQmUW7wjsRg0Ax7_C3NrY",
        "types": [
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 5
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "#102, B Wing, 1st Floor, Kul Scapes, Magarpatta Road, Opp. Reliance Smart, Kharadi, Pune, Maharashtra 411014, India",
        "geometry": {
            "location": {
                "lat": 18.5515606,
                "lng": 73.93671209999999
            },
            "viewport": {
                "northeast": {
                    "lat": 18.55297737989272,
                    "lng": 73.93826442989271
                },
                "southwest": {
                    "lat": 18.55027772010728,
                    "lng": 73.93556477010728
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        "icon_background_color": "#7B9EB0",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        "name": "Apollo Clinic",
        "opening_hours": {
            "open_now": false
        },
        "photos": [
            {
                "height": 3120,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/106937978284201017833\">Indrabhan yadav</a>"
                ],
                "photo_reference": "AVzFdbkwP4heQo9kDSooQIGDl31dXVyxcWMEV1BCqz3ET4Mc4qI8nSZNaD0Y7E_g_nm4uo02MojRWTnm3I10PuxPoyVUcdblstqED7QlWtzKOznOsUVLHK93dFqairbmHnOyFc6QOcoauzBq77PU22L5dIgx1xFieA7rd6vOhG8ZTligow72",
                "width": 4160
            }
        ],
        "place_id": "ChIJ219Xj9jDwjsRMws8ZKBZ4Xg",
        "plus_code": {
            "compound_code": "HW2P+JM Pune, Maharashtra",
            "global_code": "7JCMHW2P+JM"
        },
        "rating": 4.6,
        "reference": "ChIJ219Xj9jDwjsRMws8ZKBZ4Xg",
        "types": [
            "physiotherapist",
            "doctor",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 1959
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "Near, Shop No - 4,5,6, Wind wards Wing E, Sr No-236/237/1, Mouje Land Mark:, Chhatrapati Chowk, Wakad, Pune, Maharashtra 411057, India",
        "geometry": {
            "location": {
                "lat": 18.5959051,
                "lng": 73.77088970000001
            },
            "viewport": {
                "northeast": {
                    "lat": 18.59718337989273,
                    "lng": 73.77225557989273
                },
                "southwest": {
                    "lat": 18.59448372010728,
                    "lng": 73.76955592010728
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        "icon_background_color": "#7B9EB0",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        "name": "Apollo Diagnostics",
        "opening_hours": {
            "open_now": false
        },
        "photos": [
            {
                "height": 1080,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/107866575138536937089\">Satya Prakash Gupta</a>"
                ],
                "photo_reference": "AVzFdbnVPzVOYX6ms1fJ4x-xgopy9TQMRKq-NE95fRRCXGnjS1mKIaCjn8WjV0JUv96d7uS76kozbbc3_VOWWX77u1Qri5T6-0qG1jPxtL2_iAQn2PyqFmyS5ZResDUDNI2si2Pj0EwtLb2he5vPpRCmVJEVhqxoOF_5DRer3RdO6-RbpA2o",
                "width": 1920
            }
        ],
        "place_id": "ChIJ96FRdi65wjsRpt0mFVToePk",
        "plus_code": {
            "compound_code": "HQWC+99 Pune, Maharashtra",
            "global_code": "7JCMHQWC+99"
        },
        "rating": 2.5,
        "reference": "ChIJ96FRdi65wjsRpt0mFVToePk",
        "types": [
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 11
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "Kharadi - Wagholi Road, Lane Number 9, Ubale Nagar, Kharadi, Pune, Maharashtra 412207, India",
        "geometry": {
            "location": {
                "lat": 18.5690481,
                "lng": 73.95607489999999
            },
            "viewport": {
                "northeast": {
                    "lat": 18.57039877989272,
                    "lng": 73.95742437989273
                },
                "southwest": {
                    "lat": 18.56769912010728,
                    "lng": 73.95472472010728
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/hospital-71.png",
        "icon_background_color": "#F88181",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/hospital-H_pinlet",
        "name": "Apollo Care Emergency Hospital & Shatayu Neuro-Psychiatric Centre",
        "opening_hours": {
            "open_now": false
        },
        "photos": [
            {
                "height": 559,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/102518293426214158414\">A Google User</a>"
                ],
                "photo_reference": "AVzFdbnv9v438ImZmLUQGYPrcain-QebdJibu26XEesUQoY3MTuf4KM4_rOUawFKq9G7oxGCpPRiABCZ6bMiVFwM6H7fLUcc7y5ysc7Z1z2cEhCqM_CMyNW-dFA5_x5QOfIGLjCYjl9-0Dr-rOWpYMtaqcy4abHxopqjf5ZHkuOpCsmvx1IE",
                "width": 576
            }
        ],
        "place_id": "ChIJ68Am7sbDwjsRjZma7nPjJNk",
        "plus_code": {
            "compound_code": "HX94+JC Pune, Maharashtra",
            "global_code": "7JCMHX94+JC"
        },
        "rating": 4.9,
        "reference": "ChIJ68Am7sbDwjsRjZma7nPjJNk",
        "types": [
            "hospital",
            "doctor",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 163
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "S.No.103/3,Near railway gate, Manjari Bk Hadapsar Manjari railway station, Pune, Maharashtra 412307, India",
        "geometry": {
            "location": {
                "lat": 18.5126314,
                "lng": 73.969562
            },
            "viewport": {
                "northeast": {
                    "lat": 18.51399637989272,
                    "lng": 73.97090537989273
                },
                "southwest": {
                    "lat": 18.51129672010728,
                    "lng": 73.96820572010728
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/hospital-71.png",
        "icon_background_color": "#F88181",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/hospital-H_pinlet",
        "name": "Apollo Manjari Multispecilty Hospital",
        "opening_hours": {
            "open_now": true
        },
        "photos": [
            {
                "height": 960,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/113360715194822804093\">A Google User</a>"
                ],
                "photo_reference": "AVzFdblvTPFSDHMeqZnK9sV8d7zW2y-d1BmBfW0MIbEoQEthhO5a6xqdeyGQ85eSStmSP_IzJWoKvRAaSd19Xsz9O4ztR9KDD9fzs7cmU4qoZ_1dYDsoeIpIFe6QFjuascCvkRBqjfuvYHou3PkrjWDdWSgIW5Rg42UymIDKROsiCQhByYRU",
                "width": 1280
            }
        ],
        "place_id": "ChIJu-I56RTDwjsRofKvUXvJGIk",
        "plus_code": {
            "compound_code": "GX79+3R Pune, Maharashtra",
            "global_code": "7JCMGX79+3R"
        },
        "rating": 4.5,
        "reference": "ChIJu-I56RTDwjsRofKvUXvJGIk",
        "types": [
            "hospital",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 16
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "Shop 1, Shobha Guest House, Beside ICICI Bank Hinjewadi Rajiv Gandhi IT Park, Hinjawadi Phase II, Pune, Maharashtra 411057, India",
        "geometry": {
            "location": {
                "lat": 18.59514,
                "lng": 73.72113499999999
            },
            "viewport": {
                "northeast": {
                    "lat": 18.59651967989272,
                    "lng": 73.72245557989272
                },
                "southwest": {
                    "lat": 18.59382002010728,
                    "lng": 73.71975592010727
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        "icon_background_color": "#7B9EB0",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        "name": "Apollo Diagnostics - Hinjewadi",
        "opening_hours": {
            "open_now": false
        },
        "photos": [
            {
                "height": 1726,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/104822451759230997786\">A Google User</a>"
                ],
                "photo_reference": "AVzFdblfWutrVJfdnOyitaLWj3koEdRig9r3jebwXXMgNCPNdHvSFNnv3dDRz_EGgXADSKuoqgTDEE5NYTVFZ3gDMlc4VObbhjc1R11tdOxADYKZADyVa-AXKEz1NlRSaOFDzCtcTjTD6q52v4QQ1Lmubh-zTQkZ9eu5xW97SZERzQzAsSWG",
                "width": 2897
            }
        ],
        "place_id": "ChIJkZmv8c27wjsRbn1aePH6zMY",
        "plus_code": {
            "compound_code": "HPWC+3F Pune, Maharashtra",
            "global_code": "7JCMHPWC+3F"
        },
        "rating": 3,
        "reference": "ChIJkZmv8c27wjsRbn1aePH6zMY",
        "types": [
            "doctor",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 3
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "Shop No 3, BRTS Road, near Govind Yashada Chowk, behind Govind Garden Restaurant, Ganeesham D, Sai Nagar Park, Pimple Saudagar, Pune, Pimpri-Chinchwad, Maharashtra 411027, India",
        "geometry": {
            "location": {
                "lat": 18.5970833,
                "lng": 73.8042889
            },
            "viewport": {
                "northeast": {
                    "lat": 18.59834932989272,
                    "lng": 73.80562967989273
                },
                "southwest": {
                    "lat": 18.59564967010727,
                    "lng": 73.80293002010728
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
        "icon_background_color": "#7B9EB0",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
        "name": "Apollo Diagnostics - Pimple Saudagar",
        "opening_hours": {
            "open_now": false
        },
        "photos": [
            {
                "height": 3145,
                "html_attributions": [
                    "<a href=\"https://maps.google.com/maps/contrib/102438459094104649062\">Apollo Diagnostics Pimple Saudagar</a>"
                ],
                "photo_reference": "AVzFdbk6nNulASgO9xKo_oIh02pbnOzGuAkl2ElAq5WkipW8-lUsqWcHopKAN6heYB7iM0kmWFHSyY9etrH6J8DuF6IDzP8_lgegWfRGRzMyIiV12Ppj0I8F16ljcvgMLgnHIBK6tieOAhQM0_wKGLHDsMUBMKjXAzutB0x370d1haUsEb32",
                "width": 4193
            }
        ],
        "place_id": "ChIJ5xhAree4wjsRzlZkSzX-IEE",
        "plus_code": {
            "compound_code": "HRW3+RP Pune, Maharashtra",
            "global_code": "7JCMHRW3+RP"
        },
        "rating": 4.5,
        "reference": "ChIJ5xhAree4wjsRzlZkSzX-IEE",
        "types": [
            "doctor",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 63
    },
    {
        "business_status": "OPERATIONAL",
        "formatted_address": "Apollo Hospitals, Shankar Sheth Rd, Ghorpade Peth, Swargate, Pune, Maharashtra 411042, India",
        "geometry": {
            "location": {
                "lat": 18.5002297,
                "lng": 73.86463359999999
            },
            "viewport": {
                "northeast": {
                    "lat": 18.50154567989272,
                    "lng": 73.86598522989271
                },
                "southwest": {
                    "lat": 18.49884602010728,
                    "lng": 73.86328557010728
                }
            }
        },
        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/hospital-71.png",
        "icon_background_color": "#F88181",
        "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/hospital-H_pinlet",
        "name": "Royal Mudhol Apollo Hospitals",
        "opening_hours": {
            "open_now": false
        },
        "place_id": "ChIJL98KUADBwjsRC6OIIsDvx30",
        "plus_code": {
            "compound_code": "GV27+3V Pune, Maharashtra",
            "global_code": "7JCMGV27+3V"
        },
        "rating": 5,
        "reference": "ChIJL98KUADBwjsRC6OIIsDvx30",
        "types": [
            "hospital",
            "health",
            "point_of_interest",
            "establishment"
        ],
        "user_ratings_total": 2
    }
];

// Define CSV file path
const csvFilePath = './places.csv';

// Define the CSV headers and fields
const csvWriter = createObjectCsvWriter({
  path: csvFilePath,
  header: [
    { id: 'lat', title: 'Lat' },
    { id: 'lng', title: 'Lng' },
    { id: 'icon', title: 'Icon' },
    { id: 'name', title: 'Name' },
    { id: 'placeid', title: 'PlaceId' },
    { id: 'rating', title: 'Rating' },
    { id: 'user_ratings_total', title: 'User Ratings Total' }
  ]
});

// Prepare data in the required format
const records = places.map(place => ({
  lat: place.geometry.location.lat,
  lng: place.geometry.location.lng,
  icon: place.icon,
  name: place.name,
  placeid: place.place_id,
  rating: place.rating,
  user_ratings_total: place.user_ratings_total
}));

// Write data to CSV
csvWriter.writeRecords(records)
  .then(() => {
    console.log('CSV file was written successfully');
  })
  .catch(err => {
    console.error('Error writing CSV file:', err);
  });
