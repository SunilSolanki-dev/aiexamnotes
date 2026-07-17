import React, { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas-pro'
import MermaidSetup from './MermaidSetup'

const PRIORITY_LEVELS = ["⭐", "⭐⭐", "⭐⭐⭐"]

const markdownComponents = {
  h1: ({ children }) => <h1 className='text-xl font-bold text-gray-800 mb-3'>{children}</h1>,
  h2: ({ children }) => <h2 className='text-lg font-semibold text-indigo-700 mt-5 mb-2'>{children}</h2>,
  h3: ({ children }) => <h3 className='text-base font-semibold text-indigo-600 mt-4 mb-2'>{children}</h3>,
  p: ({ children }) => <p className='text-sm text-gray-700 leading-relaxed mb-3'>{children}</p>,
  ul: ({ children }) => <ul className='list-disc list-inside text-sm text-gray-700 space-y-1 mb-3'>{children}</ul>,
  ol: ({ children }) => <ol className='list-decimal list-inside text-sm text-gray-700 space-y-1 mb-3'>{children}</ol>,
  strong: ({ children }) => <strong className='font-semibold text-gray-900'>{children}</strong>,
  hr: () => <hr className='my-4 border-gray-200' />,
}

function FinalResult({ result }) {
  const [revisionMode, setRevisionMode] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const printRef = useRef(null);

  if (!result) {
    return null;
  }

  const subTopics = result.subTopics || {};
  const hasSubTopics = PRIORITY_LEVELS.some((level) => subTopics[level]?.length > 0);
  const hasDiagram = !!result.diagram?.data;
  const hasCharts = Array.isArray(result.charts) && result.charts.length > 0;
  const hasQuestions = result.questions?.short?.length > 0 || result.questions?.long?.length > 0;
  const hasRevisionPoints = Array.isArray(result.revisionPoints) && result.revisionPoints.length > 0;

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    try {
      const sourceCanvas = await html2canvas(printRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 32;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      const pxPerPt = sourceCanvas.width / contentWidth;
      const pageSliceHeightPx = contentHeight * pxPerPt;

      let renderedPx = 0;
      let firstPage = true;

      while (renderedPx < sourceCanvas.height) {
        const sliceHeightPx = Math.min(pageSliceHeightPx, sourceCanvas.height - renderedPx);

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = sourceCanvas.width;
        pageCanvas.height = sliceHeightPx;
        const ctx = pageCanvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          sourceCanvas,
          0, renderedPx, sourceCanvas.width, sliceHeightPx,
          0, 0, sourceCanvas.width, sliceHeightPx
        );

        const sliceHeightPt = sliceHeightPx / pxPerPt;

        if (!firstPage) pdf.addPage();
        pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", margin, margin, contentWidth, sliceHeightPt);

        renderedPx += sliceHeightPx;
        firstPage = false;
      }

      pdf.save(`${(result.title || "exam-notes").replace(/\s+/g, "-").toLowerCase()}.pdf`);
    } catch (error) {
      console.log('pdf error', error);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div ref={printRef} className='space-y-8'>
      <div className='flex items-center justify-between gap-3 flex-wrap'>
        <div>
          <h2 className='text-2xl font-bold text-gray-800'>🔲 Generated Notes</h2>
          {result.title && <p className='text-sm text-gray-500 mt-1'>{result.title}</p>}
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setRevisionMode((prev) => !prev)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${revisionMode ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
          >
            ⚡ Quick Revision (5 min)
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className='px-4 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60 cursor-pointer'
          >
            📥 {downloading ? "Preparing..." : "Download PDF"}
          </button>
        </div>
      </div>

      {revisionMode && hasRevisionPoints ? (
        <div className='bg-emerald-50 border border-emerald-100 rounded-xl p-5'>
          <p className='text-sm font-semibold text-emerald-700 mb-3'>⚡ 5-Minute Revision Points</p>
          <ul className='list-disc list-inside text-sm text-gray-700 space-y-1'>
            {result.revisionPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          {hasSubTopics && (
            <section>
              <p className='text-sm font-semibold text-gray-700 mb-3'>🌟 Sub Topics</p>
              <div className='grid gap-3 md:grid-cols-3'>
                {PRIORITY_LEVELS.map((level) => (
                  subTopics[level]?.length > 0 && (
                    <div key={level} className='bg-gray-50 border border-gray-100 rounded-xl p-3'>
                      <p className='text-xs font-semibold text-amber-500 mb-2'>{level} Priority</p>
                      <ul className='list-disc list-inside text-sm text-gray-700 space-y-1'>
                        {subTopics[level].map((name, i) => (
                          <li key={i}>{name}</li>
                        ))}
                      </ul>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          {result.notes && (
            <section>
              <p className='text-sm font-semibold text-gray-700 mb-3'>📝 Detailed Notes</p>
              <div>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {result.notes}
                </ReactMarkdown>
              </div>
            </section>
          )}

          {hasDiagram && (
            <section>
              <p className='text-sm font-semibold text-gray-700 mb-2'>📈 Diagram</p>
              <MermaidSetup diagram={result.diagram.data} />
            </section>
          )}

          {hasCharts && (
            <section className='space-y-6'>
              <p className='text-sm font-semibold text-gray-700'>📊 Charts</p>
              {result.charts.map((chart, index) => {
                const maxValue = Math.max(...chart.data.map((d) => d.value), 1);
                return (
                  <div key={index} className='border border-gray-200 rounded-xl p-4'>
                    <p className='text-sm font-medium text-gray-700 mb-3'>{chart.title}</p>
                    <div className='space-y-2'>
                      {chart.data.map((point, i) => (
                        <div key={i} className='flex items-center gap-3'>
                          <span className='text-xs text-gray-600 w-24 shrink-0 truncate'>{point.name}</span>
                          <div className='flex-1 bg-gray-100 rounded-full h-3 overflow-hidden'>
                            <div
                              className='h-full bg-indigo-500 rounded-full'
                              style={{ width: `${(point.value / maxValue) * 100}%` }}
                            />
                          </div>
                          <span className='text-xs text-gray-600 w-8 text-right shrink-0'>{point.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {hasQuestions && (
            <section className='bg-rose-50 border border-rose-100 rounded-xl p-5'>
              <p className='text-sm font-semibold text-rose-700 mb-4'>❓ Important Questions</p>

              {result.questions.short?.length > 0 && (
                <div className='mb-4'>
                  <p className='text-xs font-semibold text-gray-500 mb-2'>Short Questions</p>
                  <ul className='list-disc list-inside text-sm text-gray-700 space-y-1'>
                    {result.questions.short.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.questions.long?.length > 0 && (
                <div>
                  <p className='text-xs font-semibold text-gray-500 mb-2'>Long Questions</p>
                  <ul className='list-disc list-inside text-sm text-gray-700 space-y-1'>
                    {result.questions.long.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  )
}

export default FinalResult
