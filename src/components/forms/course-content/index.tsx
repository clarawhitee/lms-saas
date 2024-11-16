"use client";
import { HtmlParser } from "@/components/global/html-parser";
import { Loader } from "@/components/global/loader";
import BlockTextEditor from "@/components/global/rich-text-editor";
import { Button } from "@/components/ui/button";
import { useCourseContent, useCourseSectionInfo } from "@/hooks/courses";
import clsx from "clsx";

type CourseContentFormProps = {
  sectionid: string;
  userid: string;
  groupid: string;
};

export const CourseContentForm = ({
  sectionid,
  userid,
  groupid,
}: CourseContentFormProps) => {
  const { data } = useCourseSectionInfo(sectionid);

  const {
    errors,
    onUpdateContent,
    setJsonDescription,
    setOnDescription,
    onEditDescription,
    setOnHtmlDescription,
    editor,
    isPending,
  } = useCourseContent(
    sectionid,
    data?.section?.content || null,
    data?.section?.JsonContent || null,
    data?.section?.htmlContent || null
  );

  return groupid === userid ? (
    <form
      onSubmit={onUpdateContent}
      className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-lg transition-all duration-300 max-w-2xl mx-auto"
      ref={editor}
    >
      <BlockTextEditor
        onEdit={onEditDescription}
        max={10000}
        inline
        min={100}
        disabled={userid !== groupid}
        name="jsoncontent"
        errors={errors}
        setContent={setJsonDescription}
        content={JSON.parse(data?.section?.JsonContent!)}
        htmlContent={data?.section?.htmlContent || undefined}
        setHtmlContent={setOnHtmlDescription}
        textContent={data?.section?.content || undefined}
        setTextContent={setOnDescription}
      />
      {onEditDescription && (
        <Button
          className={clsx(
            "mt-4 self-end bg-black text-white rounded-md border border-gray-300 px-6 py-3",
            "hover:bg-gray-800 active:bg-black",
            "transition-all duration-300"
          )}
          variant="outline"
          disabled={isPending}
        >
          <Loader loading={isPending} spinnerSize={18}>
            Save Content
          </Loader>
        </Button>
      )}
    </form>
  ) : (
    <div className="p-5 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <HtmlParser html={data?.section?.htmlContent!} />
    </div>
  );
};
