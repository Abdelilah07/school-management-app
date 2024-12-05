import React from 'react';
import { Building2, Calendar, User, Users2 } from 'lucide-react';

const Convocation = ({ name, date, group }) => {

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

        <h2 className="text-3xl font-bold text-center text-gray-900 border-2 border-gray-300 py-4 rounded-lg ">
          Convocation
        </h2>

        <div className="space-y-4">
          <p className="text-xl font-semibold text-gray-900">
            Le conseil de discipline
          </p>

          <div className=" text-gray-800">
            <div className="flex items-center space-x-4 p-3  rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <span className="font-semibold w-48">Nom & Prénom:</span>
              <span className="flex-1">{name?.toUpperCase()}</span>
            </div>
            
            
            <div className="flex items-center space-x-4 p-3  rounded-lg">
              <Users2 className="w-5 h-5 text-gray-600" />
              <span className="font-semibold w-48">Filière & Groupe:</span>
              <span className="flex-1">{group.toUpperCase()}</span>
            </div>
            
            <div className="flex items-center space-x-4 p-3  rounded-lg">
              <Building2 className="w-5 h-5 text-gray-600" />
              <span className="font-semibold w-48">Année de Formation:</span>
              <span className="flex-1">2024/2025</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-800 text-lg">
            Est à vouloir bien présenter au conseil disciplinaire qui aura lieu à l'ISTA AIT MELLOUL:
          </p>

          <div className="flex items-center space-x-4 p-3  rounded-lg">
            <Calendar className="w-5 h-5 text-gray-900" />
            <span className="font-semibold text-black">Le :</span>
            <span className="text-gray-800">{date}</span>
          </div>
          <p className="text-xl font-semibold text-center text-black border-b pb-2">Objet</p>
          <div className="text-black flex justify-between mx-9">
              
              <div>
                  {['Les retards', 'Les absences', 'Le comportement inadapté', 'Le non-respect des consignes'].map((item, index) => (
                      <li key={index} className="flex items-center p-3 rounded-lg">
                          <div className="w-4 h-4  rounded border border-gray-600 mr-3"></div>
                          {item}
                      </li>
                  ))}
              </div>
              <div >
                  {['L\'insubordination', 'La négligence', 'Le non-respect du règlement'].map((item, index) => (
                      <li key={index} className="flex items-center p-3 rounded-lg">
                          <div className="w-4 h-4  rounded border border-gray-600 mr-3"></div>
                          {item}
                      </li>
                  ))}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Convocation;