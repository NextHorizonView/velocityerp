
'use client';
import React, { useState } from 'react';
import { MoreVertical, Plus, Paperclip, Image, Video, FileText, Trash } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RichTextEditor from '@/components/RichTextEditor';
import { Descendant } from 'slate';

type MediaItem = {
  name: string;
  type: 'image' | 'video' | 'document';
};

const ClassTeacherNoticeComponent: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [,setContent] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [medias, setMedias] = useState<MediaItem[]>([
    { name: 'Document name.png', type: 'image' },
    { name: 'Document name.mp4', type: 'video' },
    { name: 'Document name.doc', type: 'document' }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).map((file) => {
        let fileType: MediaItem['type'];
        if (file.type.startsWith('image')) {
          fileType = 'image';
        } else if (file.type.startsWith('video')) {
          fileType = 'video';
        } else {
          fileType = 'document';
        }

        return {
          name: file.name,
          type: fileType,
        };
      });

      setMedias((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDeleteMedia = (index: number): void => {
    setMedias((prev) => prev.filter((_, i) => i !== index));
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5 text-gray-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-gray-600" />;
      case 'document':
        return <FileText className="w-5 h-5 text-gray-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Class Teacher (7th A)</h2>
        <button className="text-[#576086] hover:underline">View Class</button>
      </div>

      <Card className="bg-gray-50 shadow-md">
        <CardContent className="p-6 space-y-6">
          <input
            type="text"
            placeholder="Your Title Goes Here..."
            className="w-full p-3 text-lg border rounded-md outline-none bg-gray-50"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <RichTextEditor
            placeholder="Write your content here..."
            onChange={setContent}
          />

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-600">Medias</h3>
            <div className="space-y-2">
              {medias.map((media, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    {getIconForType(media.type)}
                    <span className="text-sm text-gray-700">{media.name}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => handleDeleteMedia(index)}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>

            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 bg-gray-100 cursor-pointer hover:bg-gray-200">
                <Paperclip className="w-5 h-5" />
                <span>Attach File</span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileUpload}
                />
              </label>
              <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-white bg-[#576086] hover:bg-blue-700">
                <Plus className="w-5 h-5" />
                New Document
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                className="px-3 py-1.5 text-sm border rounded-lg text-gray-600"
                dateFormat="dd/MM/yyyy"
              />
              <Select>
                <SelectTrigger className="bg-[#576086] text-white hover:bg-blue-700">
                  <SelectValue placeholder="Assign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <button className="px-6 py-2 text-white bg-[#576086] rounded-lg hover:bg-blue-700">
              Post
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassTeacherNoticeComponent;