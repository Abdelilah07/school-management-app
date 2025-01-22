import { Building2, Calendar, Clock, User, Users2 } from 'lucide-react';

const Tawbikh = () => {
  return (
    <div className="bg-white p-8 w-[210mm] h-[297mm] mx-auto">
      <div className="bg-white p-8 font-sans text-right">
        {/* Page 1 */}
        <div className="mb-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold mb-2">مكتب التكوين المهني وإنعاش الشغل</h1>
            <h2 className="text-lg font-semibold mb-2">
              المعهد المتخصص للتكنولوجيا التطبيقية تاسيال
            </h2>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-4 text-center">توبيخ</h3>

          {/* Body */}
          <div className="mb-4">
            <p className="mb-2">
              عملاً بالقانون الداخلي للمؤسسات التكوينية التابعة لمكتب التكوين المهني وإنعاش الشغل،
              وخاصة ما يتعلق باحترام والالتزام بمضامين القانون الداخلي للمؤسسة، ونظرًا للأسباب
              الآتية:
            </p>
            <ul className="list-disc list-inside pr-4 mb-4">
              <li>……… ☑</li>
              <li>……… ☑</li>
              <li>……… ☑</li>
              <li>……… ☑</li>
            </ul>
            <p className="mb-2">فقد تقرر ما يلي:</p>
            <p className="mb-2">يوجه توبيخ إلى:</p>
            <div className="pr-4">
              <p>……… (المتدرب)</p>
              <p>……… التخصص</p>
              <p>……… الفوج</p>
              <p>……… بتاريخ: ……… الإمضاء</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tawbikh;
