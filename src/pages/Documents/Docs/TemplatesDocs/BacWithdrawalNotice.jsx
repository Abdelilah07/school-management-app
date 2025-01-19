

const BacWithdrawalNotice = ({ name, group, date, cin, student, reason }) => {
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
              ISTA AIT MELLOUL
            </h1>
            <p className="text-gray-700 mt-2 text-lg">Institut des Sciences et Techniques Appliquées</p>
          </div>
  
          <h2 className="text-3xl font-bold text-center text-gray-900 border-2 border-gray-300 py-4 rounded-lg">
            Demande de Retrait Temporaire du Bac
          </h2>
  
          <div className="space-y-4">
            <p className="text-xl font-semibold text-gray-900">
              Je soussigné(e), {name}, déclare avoir procédé au retrait temporaire de mon Bac de l'ISTA AIT MELLOUL pour les raisons suivantes :
            </p>
  
            <p className="text-lg text-gray-700">
              Date de retrait : {date}
            </p>
  
            <p className="text-lg font-semibold text-gray-900 mt-4">Raison :</p>
            <div className="text-gray-800">
              {reason && reason.length > 0 ? (
                <p>{reason.join(", ")}</p>
              ) : (
                <p>Aucune raison spécifiée.</p>
              )}
            </div>
  
            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-900">Détails de l'Étudiant :</p>
              <div className="text-gray-800">
                <div className="flex items-center space-x-4 p-3 rounded-lg">
                  <span className="font-semibold w-48">Nom :</span>
                  <span className="flex-1">{name}</span>
                </div>
  
                <div className="flex items-center space-x-4 p-3 rounded-lg">
                  <span className="font-semibold w-48">CIN :</span>
                  <span className="flex-1">{cin}</span>
                </div>
  
                <div className="flex items-center space-x-4 p-3 rounded-lg">
                  <span className="font-semibold w-48">Date de Naissance :</span>
                  <span className="flex-1">{student?.dob || 'Non spécifiée'}</span>
                </div>
  
                <div className="flex items-center space-x-4 p-3 rounded-lg">
                  <span className="font-semibold w-48">Niveau d'Éducation :</span>
                  <span className="flex-1">{student?.level || 'Non spécifié'}</span>
                </div>
  
                <div className="flex items-center space-x-4 p-3 rounded-lg">
                  <span className="font-semibold w-48">Spécialité :</span>
                  <span className="flex-1">{group}</span>
                </div>
              </div>
            </div>
          </div>
  
          <footer className="text-center mt-6">
            <p>Signé par : <strong>Représentant de l'institution</strong></p>
            <p>Date de l'émission : {date || new Date().toLocaleDateString()}</p>
          </footer>
        </div>
      </div>
    );
  };
  
  export default BacWithdrawalNotice;