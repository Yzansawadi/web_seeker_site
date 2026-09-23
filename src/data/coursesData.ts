import { Course } from '../types';

export const INITIAL_COURSES_DATA: Record<number, Record<string, Course>> = {
  "1": {
    "601100": {
      "code": "601100",
      "name": "فيزياء عامة للعلوم الطبية ( عملي )",
      "year": 1,
      "sessions": [
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "10:00 AM",
          "start_min": 480,
          "end_min": 600,
          "room": "7004",
          "section": "1",
          "teacher": "حمزة مشلوط"
        },
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "10:00 AM",
          "end": "12:00 PM",
          "start_min": 600,
          "end_min": 720,
          "room": "7004",
          "section": "2",
          "teacher": "حمزة مشلوط"
        },
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "2:00 PM",
          "start_min": 720,
          "end_min": 840,
          "room": "7004",
          "section": "3",
          "teacher": "حمزة مشلوط"
        },
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "2:00 PM",
          "end": "4:00 PM",
          "start_min": 840,
          "end_min": 960,
          "room": "7004",
          "section": "4",
          "teacher": "حمزة مشلوط"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "2:00 PM",
          "start_min": 720,
          "end_min": 840,
          "room": "7004",
          "section": "5",
          "teacher": "نائلة ابراهيم الامام"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "2:00 PM",
          "end": "4:00 PM",
          "start_min": 840,
          "end_min": 960,
          "room": "7004",
          "section": "6",
          "teacher": "نائلة ابراهيم الامام"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "10:00 AM",
          "start_min": 480,
          "end_min": 600,
          "room": "7004",
          "section": "1",
          "teacher": "حمزة مشلوط"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "10:00 AM",
          "end": "12:00 PM",
          "start_min": 600,
          "end_min": 720,
          "room": "7004",
          "section": "2",
          "teacher": "حمزة مشلوط"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "2:00 PM",
          "start_min": 720,
          "end_min": 840,
          "room": "7004",
          "section": "3",
          "teacher": "حمزة مشلوط"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "2:00 PM",
          "end": "4:00 PM",
          "start_min": 840,
          "end_min": 960,
          "room": "7004",
          "section": "4",
          "teacher": "حمزة مشلوط"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "2:00 PM",
          "start_min": 720,
          "end_min": 840,
          "room": "7004",
          "section": "5",
          "teacher": "نائلة ابراهيم الامام"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "2:00 PM",
          "end": "4:00 PM",
          "start_min": 840,
          "end_min": 960,
          "room": "7004",
          "section": "6",
          "teacher": "نائلة ابراهيم الامام"
        }
      ]
    },
    "601110": {
      "code": "601110",
      "name": "فيزياء عامة للعلوم الطبية ( نظري )",
      "year": 1,
      "sessions": [
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "4012",
          "section": "1",
          "teacher": "د. رغد زين"
        }
      ]
    },
    "602105": {
      "code": "602105",
      "name": "كيمياء عامة للعوم الطبية ( عملي )",
      "year": 1,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "7220",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "7220",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "602103": {
      "code": "602103",
      "name": "كيمياء عامة للعوم الطبية ( نظري )",
      "year": 1,
      "sessions": [
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "7007B",
          "section": "1",
          "teacher": "د. منيب شهدا"
        }
      ]
    },
    "201102": {
      "code": "201102",
      "name": "علم الحياة الجزيئية",
      "year": 1,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "8211",
          "section": "1",
          "teacher": "د.نزار عيسى"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "7224 م أحياء",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "7224 م أحياء",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "701122": {
      "code": "701122",
      "name": "رسم وتشريح الاسنان",
      "year": 1,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر7",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر7",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6128",
          "section": "1",
          "teacher": "د. أنس عبده"
        }
      ]
    },
    "201127": {
      "code": "201127",
      "name": "كيمياء عضوية ( عملي )",
      "year": 1,
      "sessions": [
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "7226 م كيمياء",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "7226 م كيمياء",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "201123": {
      "code": "201123",
      "name": "كيمياء عضوية ( نظري )",
      "year": 1,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "7013",
          "section": "1",
          "teacher": "د.حياة طبيخ"
        }
      ]
    },
    "701119": {
      "code": "701119",
      "name": "علم وظائف الأعضاء ( العملي )",
      "year": 1,
      "sessions": []
    },
    "701113": {
      "code": "701113",
      "name": "علم وظائف الأعضاء ( النظري )",
      "year": 1,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "6120",
          "section": "1",
          "teacher": "د. أمل الضاهر"
        }
      ]
    },
    "701251": {
      "code": "701251",
      "name": "علم النسج 1",
      "year": 1,
      "sessions": [
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر1",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر1",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6121",
          "section": "1",
          "teacher": "د. رولا عز الدين"
        }
      ]
    },
    "701111": {
      "code": "701111",
      "name": "علم الوراثة",
      "year": 1,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "10:00 AM",
          "start_min": 480,
          "end_min": 600,
          "room": "6129",
          "section": "1",
          "teacher": "د. لبنى مقراني"
        }
      ]
    }
  },
  "2": {
    "101201": {
      "code": "101201",
      "name": "المواد السنية  1",
      "year": 2,
      "sessions": [
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر3",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر3",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "2:00 PM",
          "start_min": 720,
          "end_min": 840,
          "room": "6121",
          "section": "1",
          "teacher": "د. صفوح البني"
        }
      ]
    },
    "101221": {
      "code": "101221",
      "name": "طب الأسنان الوقائي",
      "year": 2,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر شمع",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر شمع",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "2:00 PM",
          "start_min": 720,
          "end_min": 840,
          "room": "6120",
          "section": "1",
          "teacher": "د. نغم خوري"
        }
      ]
    },
    "701221": {
      "code": "701221",
      "name": "التشريح العام",
      "year": 2,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6118",
          "section": "1",
          "teacher": "د.محمد المقداد"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر5",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر5",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "701281": {
      "code": "701281",
      "name": "علم الأحياء الدقيقة",
      "year": 2,
      "sessions": [
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "7215",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "7215",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "7011",
          "section": "1",
          "teacher": "د. خليل محمد القوتلي"
        }
      ]
    },
    "101292": {
      "code": "101292",
      "name": "قوانين وأخلاقيات ممارسة طب الأسنان",
      "year": 2,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "10:00 AM",
          "end": "12:00 PM",
          "start_min": 600,
          "end_min": 720,
          "room": "6126",
          "section": "1",
          "teacher": "د. محمود عبد الحق"
        }
      ]
    },
    "701241": {
      "code": "701241",
      "name": "علم الجنين",
      "year": 2,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "2:00 PM",
          "start_min": 720,
          "end_min": 840,
          "room": "6118",
          "section": "1",
          "teacher": "د.محمد المقداد"
        }
      ]
    },
    "602109": {
      "code": "602109",
      "name": "كيمياء حيوية 1 ( عملي )",
      "year": 2,
      "sessions": []
    },
    "602108": {
      "code": "602108",
      "name": "كيمياء حيوية 1 ( نظري )",
      "year": 2,
      "sessions": []
    },
    "701272": {
      "code": "701272",
      "name": "(2)علم النسج الفموي",
      "year": 2,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر1",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر2",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "6121",
          "section": "2",
          "teacher": "د. رولا عز الدين"
        }
      ]
    },
    "101202": {
      "code": "101202",
      "name": "المواد السنية 2",
      "year": 2,
      "sessions": [
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر4",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "10:00 AM",
          "start_min": 480,
          "end_min": 600,
          "room": "6121",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر4",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101231": {
      "code": "101231",
      "name": "علم الأشعة السنية",
      "year": 2,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "2:00 PM",
          "start_min": 720,
          "end_min": 840,
          "room": "6127",
          "section": "1",
          "teacher": "د. محمد يحيى سالم ركاب"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر3",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر3",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101234": {
      "code": "101234",
      "name": "مداوة الأسنان المحافظة 1",
      "year": 2,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر6",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "6119",
          "section": "1",
          "teacher": "د. رنا الحج حسين"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر6",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "701261": {
      "code": "701261",
      "name": "علم الأدوية الخاص بالفم والأسنان",
      "year": 2,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "10:00 AM",
          "start_min": 480,
          "end_min": 600,
          "room": "7124-7120",
          "section": "1",
          "teacher": "د. باسمة عرابي"
        },
        {
          "day": "الثلاثاء",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "10:00 AM",
          "start_min": 480,
          "end_min": 600,
          "room": "7124-7120",
          "section": "1",
          "teacher": "د. باسمة عرابي"
        }
      ]
    },
    "701212": {
      "code": "701212",
      "name": "كيمياء حيوية 2",
      "year": 2,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "7227م",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "7227م",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "10:00 AM",
          "start_min": 480,
          "end_min": 600,
          "room": "7120",
          "section": "1",
          "teacher": "د. راما عياش"
        }
      ]
    },
    "701291": {
      "code": "701291",
      "name": "الإحصاء الطبي",
      "year": 2,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "2:00 PM",
          "end": "4:00 PM",
          "start_min": 840,
          "end_min": 960,
          "room": "6130",
          "section": "1",
          "teacher": "د. حيدر عباس"
        }
      ]
    },
    "703311": {
      "code": "703311",
      "name": "الجراحة العامة لطب الاسنان",
      "year": 2,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر5",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر5",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6120",
          "section": "1",
          "teacher": "د.محمد يحيى محمد رئيف حمادة الخياط"
        }
      ]
    }
  },
  "3": {
    "101241": {
      "code": "101241",
      "name": "تعويضات الأسنان الثابتة  1",
      "year": 3,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر4",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر4",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6126",
          "section": "1",
          "teacher": "ه.ت"
        }
      ]
    },
    "101334": {
      "code": "101334",
      "name": "(2) المحافظة الأسنان مداواة",
      "year": 3,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "6119",
          "section": "1",
          "teacher": "د.كنده ليوس"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر6",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر6",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101361": {
      "code": "101361",
      "name": "علم الاطباق السني",
      "year": 3,
      "sessions": [
        {
          "day": "الثلاثاء",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "10:00 AM",
          "start_min": 480,
          "end_min": 600,
          "room": "6124",
          "section": "1",
          "teacher": "د.علياء الشلاح"
        }
      ]
    },
    "701351": {
      "code": "701351",
      "name": "التشريح المرضي العام",
      "year": 3,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6120",
          "section": "1",
          "teacher": "د. أحمد منديلي"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر1",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر1",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101344": {
      "code": "101344",
      "name": "التعويضات السنية الجزئية المتحركة  1",
      "year": 3,
      "sessions": [
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر7",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر7",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6130",
          "section": "1",
          "teacher": "د. نيرمين زريق"
        }
      ]
    },
    "702301": {
      "code": "702301",
      "name": "الأمراض الجلدية وأمراض العين والأذن",
      "year": 3,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6118",
          "section": "1",
          "teacher": "د. جورجس داوود"
        }
      ]
    },
    "702221": {
      "code": "702221",
      "name": "طب المجتمع وطب الأسنان الشرعي",
      "year": 3,
      "sessions": [
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "10:00 AM",
          "end": "2:00 PM",
          "start_min": 600,
          "end_min": 840,
          "room": "6121",
          "section": "1",
          "teacher": "د. أحمد منديلي"
        }
      ]
    },
    "701371": {
      "code": "701371",
      "name": "مكافحة العدوى",
      "year": 3,
      "sessions": [
        {
          "day": "الثلاثاء",
          "activity": "نظري",
          "start": "10:00 AM",
          "end": "12:00 PM",
          "start_min": 600,
          "end_min": 720,
          "room": "6127",
          "section": "1",
          "teacher": "د.عبير احمد"
        }
      ]
    },
    "101362": {
      "code": "101362",
      "name": "تقويم الأسنان 1",
      "year": 3,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر3",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر7",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "6124",
          "section": "1",
          "teacher": "د.علياء الشلاح"
        }
      ]
    },
    "101343": {
      "code": "101343",
      "name": "تعويضات الأسنان الثابتة 2",
      "year": 3,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "6128",
          "section": "1",
          "teacher": "د. شذى قنوت"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر4",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر4",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101381": {
      "code": "101381",
      "name": "التخدير والقلع 1",
      "year": 3,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر شمع",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6124",
          "section": "1",
          "teacher": "د. هيثم بحاح"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر شمع",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101371": {
      "code": "101371",
      "name": "أمراض النسج حول السنية 1",
      "year": 3,
      "sessions": [
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر6",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر6",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6127",
          "section": "1",
          "teacher": "د. اوس دنان"
        }
      ]
    },
    "701352": {
      "code": "701352",
      "name": "التشريح المرضي الخاص بالفم والأسنان 1",
      "year": 3,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "6125",
          "section": "1",
          "teacher": "د. اميره النور"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر2",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "3:00 PM",
          "end": "4:00 PM",
          "start_min": 900,
          "end_min": 960,
          "room": "مخبر1",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "702311": {
      "code": "702311",
      "name": "الطب الداخلي",
      "year": 3,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6130",
          "section": "1",
          "teacher": "د. عبير قدار"
        }
      ]
    }
  },
  "4": {
    "101453": {
      "code": "101453",
      "name": "طب الفم 1 ( النظري )",
      "year": 4,
      "sessions": [
        {
          "day": "الثلاثاء",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "10:00 AM",
          "start_min": 480,
          "end_min": 600,
          "room": "6038",
          "section": "1",
          "teacher": "د. نسيم يوسف"
        }
      ]
    },
    "101457": {
      "code": "101457",
      "name": "طب الفم 1 ( العملي )",
      "year": 4,
      "sessions": [
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 8",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 8",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101435": {
      "code": "101435",
      "name": "مداوة الأسنان المحافظة 3",
      "year": 4,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 6 م",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "6126",
          "section": "1",
          "teacher": "د.موفق البوبس"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 6 م",
          "section": "2",
          "teacher": "د. عماد الصابوني"
        }
      ]
    },
    "101441": {
      "code": "101441",
      "name": "التعويضات السنية الجزئية المتحركة  2",
      "year": 4,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 2ص",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6125",
          "section": "1",
          "teacher": "د. نورا زيدان"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 2ص",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "701452": {
      "code": "701452",
      "name": "التشريح المرضي الخاص بالفم والأسنان 2",
      "year": 4,
      "sessions": [
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر1",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر1",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "6120",
          "section": "1",
          "teacher": "د. أحمد منديلي"
        }
      ]
    },
    "101461": {
      "code": "101461",
      "name": "تقويم الأسنان 2",
      "year": 4,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر3",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر7",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "6119",
          "section": "1",
          "teacher": "د. محمد خونده"
        }
      ]
    },
    "101431": {
      "code": "101431",
      "name": "مداوة اسنان لبية 1",
      "year": 4,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6119",
          "section": "1",
          "teacher": "د.كنده ليوس"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر3",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر3",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101483": {
      "code": "101483",
      "name": "التخدير والقلع 2",
      "year": 4,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6022",
          "section": "1",
          "teacher": "د. مازن زيناتي"
        },
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 9",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 9",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101443": {
      "code": "101443",
      "name": "تعويضات الأسنان الثابتة 3",
      "year": 4,
      "sessions": [
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 4 ث",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6120",
          "section": "1",
          "teacher": "د.ناصر القبق"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 4 ث",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101521": {
      "code": "101521",
      "name": "التشخيص الشعاعي",
      "year": 4,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6127",
          "section": "1",
          "teacher": "د. محمد يحيى سالم ركاب"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر شمع",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر شمع",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101472": {
      "code": "101472",
      "name": "طب أسنان أطفال 1",
      "year": 4,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6128",
          "section": "1",
          "teacher": "د.ليليان أزرق"
        },
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 7 ط",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 7 ط",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101473": {
      "code": "101473",
      "name": "أمراض النسج حول السنية 2",
      "year": 4,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "10:00 AM",
          "end": "2:00 PM",
          "start_min": 600,
          "end_min": 840,
          "room": "6129",
          "section": "1",
          "teacher": "د. رويدا صايمة"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 3 ح",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 3 ح",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101436": {
      "code": "101436",
      "name": "مداواة الأسنان اللبية 2",
      "year": 4,
      "sessions": [
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر5",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر5",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6119",
          "section": "1",
          "teacher": "د. عمار عيد"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر5",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر5",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101484": {
      "code": "101484",
      "name": "التخدير والقلع 3",
      "year": 4,
      "sessions": [
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 9",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 9",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6119",
          "section": "1",
          "teacher": "د.محمد المقداد"
        }
      ]
    }
  },
  "5": {
    "101544": {
      "code": "101544",
      "name": "تعويضات الأسنان الثابتة 4",
      "year": 5,
      "sessions": [
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 4 ث",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 4 ث",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "6120",
          "section": "1",
          "teacher": "د.ناصر القبق"
        }
      ]
    },
    "101442": {
      "code": "101442",
      "name": "التعويضات السنية الكاملة المتحركة 1",
      "year": 5,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6124",
          "section": "1",
          "teacher": "د. غسان وزير"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 2ص",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 2ص",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101573": {
      "code": "101573",
      "name": "زرع الأسنان",
      "year": 5,
      "sessions": [
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "2:00 PM",
          "end": "4:00 PM",
          "start_min": 840,
          "end_min": 960,
          "room": "6119",
          "section": "1",
          "teacher": "د. غسان البسيط"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "مخبر7",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "مخبر7",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101574": {
      "code": "101574",
      "name": "أمراض النسج حول السنية 3",
      "year": 5,
      "sessions": [
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 3 ح",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 3 ح",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6129",
          "section": "1",
          "teacher": "د.محمد عاطف درويش"
        }
      ]
    },
    "101557": {
      "code": "101557",
      "name": "طب القم 2",
      "year": 5,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "2:00 PM",
          "start_min": 720,
          "end_min": 840,
          "room": "6126",
          "section": "1",
          "teacher": "د. محمود عبد الحق"
        }
      ]
    },
    "701575": {
      "code": "701575",
      "name": "طب الأسنان الشيخوخي",
      "year": 5,
      "sessions": [
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "2:00 PM",
          "start_min": 720,
          "end_min": 840,
          "room": "6022",
          "section": "1",
          "teacher": "د . سوسن طاهر"
        }
      ]
    },
    "101556": {
      "code": "101556",
      "name": "مداوة الأسنان اللبية 3",
      "year": 5,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 8",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 8",
          "section": "1",
          "teacher": "ه.ت"
        }
      ]
    },
    "101546": {
      "code": "101546",
      "name": "التعويضات السنية الكاملة المتحركة 2",
      "year": 5,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "6124",
          "section": "1",
          "teacher": "د. غسان وزير"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 2ص",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 2ص",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101537": {
      "code": "101537",
      "name": "مداواة الأسنان اللبية 4",
      "year": 5,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 6 م",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 5 ل",
          "section": "3",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 5 ل",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101545": {
      "code": "101545",
      "name": "تعويضات الأسنان الثابتة ) 5 )",
      "year": 5,
      "sessions": [
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 4 ث",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 4 ث",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    },
    "101575": {
      "code": "101575",
      "name": "أمراض النسج حول السنية 4",
      "year": 5,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 3 ح",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 3 ح",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 3 ح",
          "section": "3",
          "teacher": "ه.ت"
        }
      ]
    },
    "101586": {
      "code": "101586",
      "name": "جراحة الفم والوجه والفكين",
      "year": 5,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "2:00 PM",
          "start_min": 480,
          "end_min": 840,
          "room": "6121",
          "section": "1",
          "teacher": "د. خلدون درويش"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 9",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "2:00 PM",
          "start_min": 480,
          "end_min": 840,
          "room": "6118",
          "section": "2",
          "teacher": "د.محمد المقداد"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 9",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 9",
          "section": "3",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 9",
          "section": "4",
          "teacher": "ه.ت"
        }
      ]
    },
    "101571": {
      "code": "101571",
      "name": "(2) طب أسنان أطفال",
      "year": 5,
      "sessions": [
        {
          "day": "السبت",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6125",
          "section": "1",
          "teacher": "د.مهند لفلوف"
        },
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 7 ط",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 7 ط",
          "section": "1",
          "teacher": "ه.ت"
        }
      ]
    },
    "101535": {
      "code": "101535",
      "name": "(4)  مداواة الأسنان المحافظة",
      "year": 5,
      "sessions": [
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 6 م",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 6 م",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 6 م",
          "section": "3",
          "teacher": "ه.ت"
        }
      ]
    },
    "101585": {
      "code": "101585",
      "name": "إعادة تأهيل الفم",
      "year": 5,
      "sessions": [
        {
          "day": "الأحد",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 4 ث",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "نظري",
          "start": "12:00 PM",
          "end": "2:00 PM",
          "start_min": 720,
          "end_min": 840,
          "room": "6119",
          "section": "1",
          "teacher": "د. غسان البسيط"
        },
        {
          "day": "الثلاثاء",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 4 ث",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    }
  },
  "0": {
    "101536": {
      "code": "101536",
      "name": "مداواة الأسنان اللبية (3)",
      "year": 0,
      "sessions": [
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 5 ل",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "السبت",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 5 ل",
          "section": "2",
          "teacher": "ه.ت"
        },
        {
          "day": "الأحد",
          "activity": "نظري",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "6121",
          "section": "1",
          "teacher": "د. صفوح البني"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "8:00 AM",
          "end": "12:00 PM",
          "start_min": 480,
          "end_min": 720,
          "room": "عيادة 5 ل",
          "section": "1",
          "teacher": "ه.ت"
        },
        {
          "day": "الاثنين",
          "activity": "عملي",
          "start": "12:00 PM",
          "end": "4:00 PM",
          "start_min": 720,
          "end_min": 960,
          "room": "عيادة 5 ل",
          "section": "2",
          "teacher": "ه.ت"
        }
      ]
    }
  }
};

export const COURSES_DATA = INITIAL_COURSES_DATA;

export function getAllCourses(data: Record<number, Record<string, Course>> = COURSES_DATA): Course[] {
  const result: Course[] = [];
  Object.values(data).forEach((yearObj) => {
    Object.values(yearObj).forEach((course) => {
      result.push(course);
    });
  });
  return result;
}

export function getCoursesByYear(year: number, data: Record<number, Record<string, Course>> = COURSES_DATA): Course[] {
  const coursesObj = data[year] || {};
  return Object.values(coursesObj).sort((a, b) => a.name.localeCompare(b.name, 'ar'));
}

export function getCourseByCode(code: string, data: Record<number, Record<string, Course>> = COURSES_DATA): Course | undefined {
  for (const yearObj of Object.values(data)) {
    if (yearObj[code]) {
      return yearObj[code];
    }
  }
  return undefined;
}
