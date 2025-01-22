import { Building2, Calendar, Clock, User, Users2 } from 'lucide-react';

const ReprimandNotice = ({ name, group, date, reason = [], resen1, resen2, resen3 }) => {
  return (
    <div className="bg-white p-8 w-[210mm] h-[297mm] mx-auto">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <img
            src="https://th.bing.com/th/id/OIP.CSP7hnPoILNLCRcGO0qgiQHaHa?rs=1&pid=ImgDetMain"
            alt="OFP Logo"
            className="w-24 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            Office de la Formation Professionnelle et de la Promotion du Travail
          </h1>
          <p className="text-gray-700 mt-2 text-lg">CFIA - ISTA AIT MELLOUL</p>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900 border-2 border-gray-300 py-4 rounded-lg">
          Avis de Réprimande
        </h2>

        <div className="space-y-4">
          <p className="text-xl font-semibold text-gray-900">Le conseil de discipline</p>

          <div className="text-gray-800">
            <div className="flex items-center space-x-4 p-3 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <span className="font-semibold w-48">Nom & Prénom:</span>
              <span className="flex-1">{name?.toUpperCase()}</span>
            </div>

            <div className="flex items-center space-x-4 p-3 rounded-lg">
              <Users2 className="w-5 h-5 text-gray-600" />
              <span className="font-semibold w-48">Filière & Groupe:</span>
              <span className="flex-1">{group?.toUpperCase()}</span>
            </div>

            <div className="flex items-center space-x-4 p-3 rounded-lg">
              <Building2 className="w-5 h-5 text-gray-600" />
              <span className="font-semibold w-48">Année de Formation:</span>
              <span className="flex-1">{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-lg text-gray-800">
            En raison des manquements suivants, il a été décidé de donner une réprimande à l'élève :
          </p>

          <div className="space-y-2">
            {reason.length > 0 ? (
              reason.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg">
                  <input type="checkbox" className="w-4 h-4 mr-3" />
                  <span>{item}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-700">Aucune raison spécifique fournie.</p>
            )}
          </div>

          <p className="text-xl font-semibold text-center text-black border-b pb-2">Détails</p>

          {/* Display resen1, resen2, resen3 */}
          <div className="space-y-2">
            {resen1 && (
              <div className="flex items-center space-x-4 p-3 rounded-lg">
                <Clock className="w-4 h-4 mr-3" />
                <span className="w-4 h-4 mr-3">{resen1}</span>
              </div>
            )}
            {resen2 && (
              <div className="flex items-center space-x-4 p-3 rounded-lg">
                <Clock className="w-4 h-4 mr-3" />
                <span className="w-4 h-4 mr-3">{resen2}</span>
              </div>
            )}
            {resen3 && (
              <div className="flex items-center space-x-4 p-3 rounded-lg">
                <Clock className="w-4 h-4 mr-3" />
                <span className="w-4 h-4 mr-3">{resen3}</span>
              </div>
            )}
          </div>

          <div className="text-black flex justify-between mx-9">
            <div>
              <div className="flex items-center space-x-4 p-3 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-900" />
                <span className="font-semibold">Le :</span>
                <span>{date}</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-6">
          <p>
            Signé par: <strong>Représentant de l'institution</strong>
          </p>
          <p>Date de l'émission: {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
};

export default ReprimandNotice;
