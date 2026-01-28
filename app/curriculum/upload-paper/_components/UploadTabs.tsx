import { Tabs, TabsContent } from "@/components/ui/tabs";
import AiNotice from "./AiNotice";
import LinkUploadTab from "./LinkUploadTab";
import PdfUploadTab from "./PdfUploadTab";
import TitleUploadTab from "./TitleUploadTab";
import UploadTabsHeader from "./UploadTabsHeader";

interface UploadTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export default function UploadTabs({
  activeTab,
  setActiveTab,
  setError,
}: UploadTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='flex-1'>
      <UploadTabsHeader />

      <div className='p-8'>
        <TabsContent value='pdf' className='mt-0'>
          <PdfUploadTab setError={setError} />
        </TabsContent>

        <TabsContent value='link' className='mt-0'>
          <LinkUploadTab setError={setError} />
        </TabsContent>

        <TabsContent value='title' className='mt-0'>
          <TitleUploadTab setError={setError} />
        </TabsContent>

        <AiNotice />
      </div>
    </Tabs>
  );
}
