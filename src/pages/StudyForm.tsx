import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudyForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    studyNumber: '',
    studyCode: '',
    testItemCode: '',
    sdOrPiName: '',
    studyPlanPageNo: '',
    studyPlanAmendmentPages: '',
    dateOfReceipt: '',
    rdIndex: '',
    frIndex: '',
    blockSlidesIndex: '',
    tissuesIndex: '',
    carcassIndex: '',
    rawDataCount: '0',
    finalOrTerminatedReport: 'NA',
    amendmentToFinalReport: '',
    others: '',
    electronicDataArchivedUsingArchiveSystem: false,
    manuallyArchivingData: false,
    provantisData: false,
    empowerData: false,
    otherElectronicIfAny: false,
    detailsOfElectronicDataArchivedThrough: 'manual',
    studyCompletionDate: '',
    remarks: '',
    rawDataItems: {} as { [key: string]: string },
    blockSlidesNameBoxNo: '',
    blockSlidesNoOfBox: '',
    tissueBoxNameBoxNo: '',
    tissueBoxNoOfBox: '',
    carcassBoxNameBoxNo: '',
    carcassBoxNoOfBox: '',
  });

  const rawDataTotal = useMemo(() => {
    const n = parseInt(formData.rawDataCount || '0', 10);
    if (Number.isNaN(n) || n < 0) return 0;
    return Math.min(n, 100);
  }, [formData.rawDataCount]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRawDataItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      rawDataItems: { ...prev.rawDataItems, [index]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Persist as needed (API/localStorage placeholder)
    // eslint-disable-next-line no-console
    console.log('Study form submitted:', formData);
    alert('Study form submitted successfully!');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <h1 className="text-xl font-bold text-emerald-700">Study - Add New</h1>
          <span className="text-gray-600 text-sm">{user?.email}</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Study Details</h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                form="study-form"
                className="px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Save
              </button>
            </div>
          </div>

          <form id="study-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="studyNumber" className="block text-sm font-medium text-gray-700 mb-2">Study number</label>
                <input id="studyNumber" name="studyNumber" value={formData.studyNumber} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="studyCode" className="block text-sm font-medium text-gray-700 mb-2">Study Code</label>
                <input id="studyCode" name="studyCode" value={formData.studyCode} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="testItemCode" className="block text-sm font-medium text-gray-700 mb-2">Test Item code</label>
                <input id="testItemCode" name="testItemCode" value={formData.testItemCode} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="sdOrPiName" className="block text-sm font-medium text-gray-700 mb-2">SD/ PI name</label>
                <input id="sdOrPiName" name="sdOrPiName" value={formData.sdOrPiName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="studyPlanPageNo" className="block text-sm font-medium text-gray-700 mb-2">Study plan Pageno</label>
                <input id="studyPlanPageNo" name="studyPlanPageNo" value={formData.studyPlanPageNo} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="studyPlanAmendmentPages" className="block text-sm font-medium text-gray-700 mb-2">SP Amendment Pages</label>
                <input id="studyPlanAmendmentPages" name="studyPlanAmendmentPages" value={formData.studyPlanAmendmentPages} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="dateOfReceipt" className="block text-sm font-medium text-gray-700 mb-2">Date of receipt</label>
                <input id="dateOfReceipt" name="dateOfReceipt" type="date" value={formData.dateOfReceipt} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="rdIndex" className="block text-sm font-medium text-gray-700 mb-2">Rd index</label>
                <input id="rdIndex" name="rdIndex" value={formData.rdIndex} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="frIndex" className="block text-sm font-medium text-gray-700 mb-2">FR index</label>
                <input id="frIndex" name="frIndex" value={formData.frIndex} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="blockSlidesIndex" className="block text-sm font-medium text-gray-700 mb-2">Block & slides index</label>
                <input id="blockSlidesIndex" name="blockSlidesIndex" value={formData.blockSlidesIndex} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="tissuesIndex" className="block text-sm font-medium text-gray-700 mb-2">Tissues index</label>
                <input id="tissuesIndex" name="tissuesIndex" value={formData.tissuesIndex} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="carcassIndex" className="block text-sm font-medium text-gray-700 mb-2">Carcass index</label>
                <input id="carcassIndex" name="carcassIndex" value={formData.carcassIndex} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="rawDataCount" className="block text-sm font-medium text-gray-700 mb-2">Raw data (number)</label>
                <input id="rawDataCount" name="rawDataCount" type="number" min="0" max="100" value={formData.rawDataCount} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="finalOrTerminatedReport" className="block text-sm font-medium text-gray-700 mb-2">Final report/Terminated report</label>
                <select id="finalOrTerminatedReport" name="finalOrTerminatedReport" value={formData.finalOrTerminatedReport} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option value="NA">NA</option>
                  <option value="Final report">Final report</option>
                  <option value="Terminated Report">Terminated Report</option>
                </select>
              </div>
              <div>
                <label htmlFor="amendmentToFinalReport" className="block text-sm font-medium text-gray-700 mb-2">Amendment to final report</label>
                <input id="amendmentToFinalReport" name="amendmentToFinalReport" value={formData.amendmentToFinalReport} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="others" className="block text-sm font-medium text-gray-700 mb-2">Others</label>
                <input id="others" name="others" value={formData.others} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Electronic data archiving</h3>
              <div className="mb-4">
                <label className="inline-flex items-center gap-3">
                  <input type="checkbox" name="electronicDataArchivedUsingArchiveSystem" checked={formData.electronicDataArchivedUsingArchiveSystem} onChange={handleChange} className="h-4 w-4" />
                  <span>Electronic data is archived using Archive System Software</span>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="inline-flex items-center gap-3">
                  <input type="checkbox" name="manuallyArchivingData" checked={formData.manuallyArchivingData} onChange={handleChange} className="h-4 w-4" />
                  <span>Manually archiving data</span>
                </label>
                <label className="inline-flex items-center gap-3">
                  <input type="checkbox" name="provantisData" checked={formData.provantisData} onChange={handleChange} className="h-4 w-4" />
                  <span>Provantis data</span>
                </label>
                <label className="inline-flex items-center gap-3">
                  <input type="checkbox" name="empowerData" checked={formData.empowerData} onChange={handleChange} className="h-4 w-4" />
                  <span>Empower data</span>
                </label>
                <label className="inline-flex items-center gap-3">
                  <input type="checkbox" name="otherElectronicIfAny" checked={formData.otherElectronicIfAny} onChange={handleChange} className="h-4 w-4" />
                  <span>Others if any</span>
                </label>
              </div>
              {user?.role === 'admin' && (
                <div className="mt-4">
                  <label htmlFor="detailsOfElectronicDataArchivedThrough" className="block text-sm font-medium text-gray-700 mb-2">Details of electronic data achived through</label>
                  <select
                    id="detailsOfElectronicDataArchivedThrough"
                    name="detailsOfElectronicDataArchivedThrough"
                    value={formData.detailsOfElectronicDataArchivedThrough}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="manual">Manual</option>
                    <option value="share_point">Share Point</option>
                  </select>
                </div>
              )}
            </div>

            <div className="border rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specimens</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-semibold text-gray-800 mb-3">Block & slides</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="blockSlidesNameBoxNo" className="block text-sm font-medium text-gray-700 mb-2">Name box no</label>
                      <input id="blockSlidesNameBoxNo" name="blockSlidesNameBoxNo" value={formData.blockSlidesNameBoxNo} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label htmlFor="blockSlidesNoOfBox" className="block text-sm font-medium text-gray-700 mb-2">No of box</label>
                      <input id="blockSlidesNoOfBox" name="blockSlidesNoOfBox" value={formData.blockSlidesNoOfBox} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-gray-800 mb-3">Tissue box</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="tissueBoxNameBoxNo" className="block text-sm font-medium text-gray-700 mb-2">Name box no</label>
                      <input id="tissueBoxNameBoxNo" name="tissueBoxNameBoxNo" value={formData.tissueBoxNameBoxNo} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label htmlFor="tissueBoxNoOfBox" className="block text-sm font-medium text-gray-700 mb-2">No of box</label>
                      <input id="tissueBoxNoOfBox" name="tissueBoxNoOfBox" value={formData.tissueBoxNoOfBox} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-gray-800 mb-3">Carcass box</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="carcassBoxNameBoxNo" className="block text-sm font-medium text-gray-700 mb-2">Name box no</label>
                      <input id="carcassBoxNameBoxNo" name="carcassBoxNameBoxNo" value={formData.carcassBoxNameBoxNo} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label htmlFor="carcassBoxNoOfBox" className="block text-sm font-medium text-gray-700 mb-2">No of box</label>
                      <input id="carcassBoxNoOfBox" name="carcassBoxNoOfBox" value={formData.carcassBoxNoOfBox} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {rawDataTotal > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Raw data files</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: rawDataTotal }).map((_, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{`Raw data ${idx + 1}`}</label>
                      <input
                        value={formData.rawDataItems[String(idx)] || ''}
                        onChange={(e) => handleRawDataItemChange(idx, e)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="studyCompletionDate" className="block text-sm font-medium text-gray-700 mb-2">Study completion Date</label>
                <input id="studyCompletionDate" name="studyCompletionDate" type="date" value={formData.studyCompletionDate} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <input id="remarks" name="remarks" value={formData.remarks} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudyForm;


