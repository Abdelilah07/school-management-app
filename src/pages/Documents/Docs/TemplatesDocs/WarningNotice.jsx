const WarningNotice = ({ name, group, date, reason, trainee }) => {
  return (
    <div className="bg-white p-8 w-[210mm] h-[297mm] mx-auto">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <img
            src="https://th.bing.com/th/id/OIP.CSP7hnPoILNLCRcGO0qgiQHaHa?rs=1&pid=ImgDetMain"
            alt="Institution Logo"
            className="w-24 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            Office de la Formation Professionnelle et de la Promotion du Travail
          </h1>
          <p className="text-gray-700 mt-2 text-lg">CFIA - ISTA AIT MELLOUL</p>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900 border-2 border-gray-300 py-4 rounded-lg">
          Avertissement
        </h2>

        <div className="space-y-4">
          <p className="text-xl font-semibold text-gray-900">
            Selon le règlement intérieur des institutions de formation sous l'Office de la Formation
            Professionnelle et de la Promotion du Travail, il a été décidé de délivrer un
            avertissement pour les raisons suivantes :
          </p>

          <div className="space-y-2">
            {reason && reason.length > 0 ? (
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

          <p className="text-lg font-semibold text-gray-900 mt-4">Détails du Stagiaire :</p>
          <div className="text-gray-800">
            <div className="flex items-center space-x-4 p-3 rounded-lg">
              <span className="font-semibold w-48">Nom du Stagiaire :</span>
              <span className="flex-1">{trainee?.name}</span>
            </div>

            <div className="flex items-center space-x-4 p-3 rounded-lg">
              <span className="font-semibold w-48">Spécialité :</span>
              <span className="flex-1">{trainee?.specialty}</span>
            </div>

            <div className="flex items-center space-x-4 p-3 rounded-lg">
              <span className="font-semibold w-48">Groupe :</span>
              <span className="flex-1">{group}</span>
            </div>
          </div>
        </div>

        <footer className="text-center mt-6">
          <p>
            Signé par : <strong>Représentant de l'institution</strong>
          </p>
          <p>Date de l'émission : {date || new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
};

export default WarningNotice;
