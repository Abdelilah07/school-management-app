const BacWithdrawalFormRow = ({ name, group, date, index, details }) => {
  return (
    <div className="border border-black mb-4 p-8 h-1/2">
      {/* Header Section */}
      <div className="border-b border-black pb-2 mb-2">
        <h2 className="text-center font-bold uppercase text-sm">
          OFFPT / DRSMC / CFA / ISTA AIT MELLOUL
        </h2>
        <h3 className="text-center font-bold uppercase text-lg">Mise en Garde</h3>
      </div>

      {/* Content Section */}
      <table className="table-auto w-full border-collapse border border-black text-sm">
        <tbody>
          {/* Nom & Filière */}
          <tr>
            <td className="border border-black p-2 font-bold">Nom & Prénom</td>
            <td className="border border-black p-2">
              {name || '..................................................'}
            </td>
            <td className="border border-black p-2 font-bold">Filière</td>
            <td className="border border-black p-2">
              {group || '..................................................'}
            </td>
          </tr>

          {/* Engagement Section */}
          <tr>
            <td colSpan={4} className="border border-black p-2">
              <p className="text-justify">
                Je soussigné(e), stagiaire à l’ISTA AIT MELLOUL, m’engage à respecter les termes de
                la présente mise en garde.
              </p>
            </td>
          </tr>

          {/* Assiduité Section */}
          <tr>
            <td colSpan={4} className="border border-black p-2">
              <h4 className="text-center font-bold underline mb-2">Assiduité</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <input type="checkbox" id={`curriculum-${index}`} className="mr-2" />
                  <label htmlFor={`curriculum-${index}`}>Curriculums des Modules</label>
                </div>
                <div>
                  <input type="checkbox" id={`absences-${index}`} className="mr-2" />
                  <label htmlFor={`absences-${index}`}>Motifs des Absences</label>
                </div>
                <div>
                  <input type="checkbox" id={`other-${index}`} className="mr-2" />
                  <label htmlFor={`other-${index}`}>Autres</label>
                </div>
              </div>
              <div className="mt-2">
                <strong>Détails:</strong>{' '}
                {details ||
                  '.........................................................................'}
              </div>
            </td>
          </tr>

          {/* Date & Signature */}
          <tr>
            <td className="border border-black p-2 font-bold">Date</td>
            <td className="border border-black p-2">
              {date || '........................................'}
            </td>
            <td className="border border-black p-2 font-bold">Signature</td>
            <td className="border border-black p-2">........................................</td>
          </tr>
        </tbody>
      </table>

      {/* Footer Section */}
      <div className="text-xs text-center mt-4">
        <p>Complexe de Formation Professionnelle Inezgane - Ait Melloul</p>
        <p>Site: ISTA AIT MELLOUL</p>
        <p>ISTA AIT MELLOUL – AIT MELLOUL</p>
        <p>Tél: 05 28 30 21 69</p>
      </div>
    </div>
  );
};

const BacWithdrawalForm = ({ name, group, date, details }) => {
  return (
    <div className="bg-white p-8 w-[210mm] h-[297mm] mx-auto max-w-4xl">
      {[...Array(2)].map((_, index) => (
        <BacWithdrawalFormRow
          key={index}
          name={name}
          group={group}
          date={date}
          details={details}
          index={index}
        />
      ))}
    </div>
  );
};

export default BacWithdrawalForm;
